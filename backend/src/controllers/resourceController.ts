import { Request, Response } from 'express';
import Resource from '../models/ResourceModel';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { IUser } from '../models/UserModel';
import mongoose from 'mongoose';

// @desc    Fetch all resources with filtering, pagination
// @route   GET /api/resources
// @access  Public (approved resources) or Private/Admin (all)
export const getResources = async (req: Request, res: Response) => {
  const user = req.user as IUser | undefined; // User might not be logged in
  const { search, category, department, fileType, accessType, course, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

  const filters: any = {};
  if (!user || user.role !== 'admin') { // Non-admins only see active/approved resources
    filters.status = 'active';
    filters.isApproved = true;
  } else { // Admin can filter by status
     if (req.query.status) filters.status = req.query.status as string;
     if (req.query.isApproved !== undefined) filters.isApproved = req.query.isApproved === 'true';
  }


  if (search) {
    filters.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
      { tags: { $in: [(search as string).toLowerCase()] } },
      { course: { $regex: search as string, $options: 'i' } },
      { department: { $regex: search as string, $options: 'i' } },
    ];
  }
  if (category && category !== 'All') filters.category = category as string;
  if (department && department !== 'All') filters.department = department as string;
  if (fileType && fileType !== 'All') filters.fileType = fileType as string;
  if (accessType && accessType !== 'All') filters.accessType = accessType as string;
  if (course) filters.course = { $regex: course as string, $options: 'i' };

  const sort: any = {};
  if (typeof sortBy === 'string' && typeof sortOrder === 'string') {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default sort
  }

  try {
    const count = await Resource.countDocuments(filters);
    const resources = await Resource.find(filters)
      .populate('uploader.id', 'name avatar') // In case uploader field needs more from User model
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
        resources,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        total: count
    });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single resource by ID
// @route   GET /api/resources/:id
// @access  Public (if approved) or Private/Admin
export const getResourceById = async (req: Request, res: Response) => {
  const user = req.user as IUser | undefined;
  try {
    const resource = await Resource.findById(req.params.id).populate('uploader.id', 'name avatar');
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.status !== 'active' || !resource.isApproved) {
        if (!user || user.role !== 'admin') { // Non-admins cannot see non-active/non-approved
             // Also check if user is the uploader, they should be able to see their own pending resources
            if (resource.uploader.id.toString() !== user?._id.toString()) {
                return res.status(403).json({ message: 'Resource not available or pending approval.' });
            }
        }
    }
    res.json(resource);
  } catch (error: any) {
    console.error('Error fetching resource by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Resource not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upload/Create a new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { title, description, category, course, department, tags, accessType } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description, and category are required.' });
  }
  const file = req.file as Express.Multer.File;
  if (!file) return res.status(400).json({ message: 'File is required.' });

  try {
    if (!process.env.CLOUDINARY_URL) {
      return res.status(500).json({ message: 'Cloudinary not configured. Cannot upload file.' });
    }
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    const fileUrl = await uploadToCloudinary(dataURI, 'resources_files');

    // Determine fileType based on mimetype or extension
    let fileTypeExt = file.originalname.split('.').pop()?.toLowerCase() || 'other';
    const supportedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'dataset', 'image', 'video', 'audio'];
    if (!supportedTypes.includes(fileTypeExt)) fileTypeExt = 'other';


    const resource = new Resource({
      title, description, fileUrl,
      fileName: file.originalname,
      fileType: fileTypeExt,
      fileSize: `${(file.size / (1024*1024)).toFixed(2)} MB`, // Approx size in MB
      category, course, department,
      uploader: { id: user._id, name: user.name, avatar: user.avatar },
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t:string)=>t.trim()) : []),
      accessType: accessType || 'free',
      isApproved: false, // Requires admin approval by default
      status: 'pending_approval'
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error: any) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Server Error creating resource', error: error.message });
  }
};

// @desc    Update an existing resource (Uploader or Admin)
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { title, description, category, course, department, tags, accessType, status, isApproved } = req.body;
  // File update is not handled here for simplicity, would require new upload & old delete.

  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.uploader.id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this resource' });
    }

    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.category = category || resource.category;
    resource.course = course || resource.course;
    resource.department = department || resource.department;
    resource.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t:string)=>t.trim())) : resource.tags;
    resource.accessType = accessType || resource.accessType;

    // Admin only fields
    if (user.role === 'admin') {
        if (status) resource.status = status;
        if (isApproved !== undefined) resource.isApproved = Boolean(isApproved);
    }

    resource.updatedAt = new Date();
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error: any) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Server Error updating resource', error: error.message });
  }
};

// @desc    Delete a resource (Uploader or Admin)
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.uploader.id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this resource' });
    }

    if (resource.fileUrl && process.env.CLOUDINARY_URL) {
      try { await deleteFromCloudinary(resource.fileUrl); }
      catch (e) { console.error("Error deleting resource file from Cloudinary", e); }
    }
    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error: any) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server Error deleting resource', error: error.message });
  }
};

// @desc    Record a download for a resource
// @route   POST /api/resources/:id/download
// @access  Public (or Private if tracking user downloads)
export const recordDownload = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        if (resource.status !== 'active' || !resource.isApproved) {
            return res.status(403).json({ message: 'Resource not available.' });
        }

        resource.downloads = (resource.downloads || 0) + 1;
        await resource.save();
        // For actual download, redirect to resource.fileUrl or proxy it
        // For now, just confirming download record.
        res.json({ message: 'Download recorded', downloads: resource.downloads, fileUrl: resource.fileUrl });
    } catch (error: any) {
        console.error('Error recording download:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add or update a rating for a resource
// @route   POST /api/resources/:id/rate
// @access  Private
export const rateResource = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { rating, comment } = req.body;
    const resourceId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ message: 'Resource not found.' });
        if (resource.status !== 'active' || !resource.isApproved) {
            return res.status(403).json({ message: 'Cannot rate this resource.' });
        }
        if (resource.uploader.id.toString() === user._id.toString()) {
            return res.status(400).json({ message: 'You cannot rate your own resource.' });
        }

        const existingRatingIndex = resource.ratings?.findIndex(r => r.user.toString() === user._id.toString());

        if (existingRatingIndex !== undefined && existingRatingIndex > -1 && resource.ratings) {
            resource.ratings[existingRatingIndex].rating = Number(rating);
            resource.ratings[existingRatingIndex].comment = comment || undefined;
            resource.ratings[existingRatingIndex].createdAt = new Date();
        } else {
            resource.ratings = resource.ratings || [];
            resource.ratings.push({ user: user._id, rating: Number(rating), comment, createdAt: new Date() });
        }

        // Pre-save hook will calculate averageRating and ratingCount
        await resource.save();
        res.status(201).json({ message: 'Rating submitted successfully.', resource });

    } catch (error: any) {
        console.error('Error rating resource:', error);
        res.status(500).json({ message: 'Server error rating resource.', error: error.message });
    }
};

// @desc    Approve or reject a resource (Admin only)
// @route   PUT /api/resources/:id/approve
// @access  Private/Admin
export const approveResource = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { approved } = req.body; // Expecting { approved: true } or { approved: false }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Not authorized as an admin." });
    }
    if (approved === undefined) {
        return res.status(400).json({ message: "Approval status (approved: true/false) is required." });
    }

    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: "Resource not found." });

        resource.isApproved = Boolean(approved);
        resource.status = Boolean(approved) ? 'active' : 'rejected';

        await resource.save();
        // TODO: Notify uploader of status change
        res.json({ message: `Resource ${Boolean(approved) ? 'approved' : 'rejected'}.`, resource });

    } catch (error: any) {
        console.error("Error approving resource:", error);
        res.status(500).json({ message: "Server error approving resource.", error: error.message });
    }
};
