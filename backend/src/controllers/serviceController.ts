import { Request, Response } from 'express';
import Service from '../models/ServiceModel';
import User from '../models/UserModel'; // To populate provider info if not fully denormalized
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { IUser } from '../models/UserModel'; // Import IUser

// @desc    Fetch all services with filtering, pagination
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const { search, category, serviceType, location, rating, priceRange, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const filters: any = {};
  if (search) {
    filters.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
      { tags: { $in: [(search as string).toLowerCase()] } }
    ];
  }
  if (category && category !== 'All') filters.category = category as string;
  if (serviceType) {
    const serviceTypes = (serviceType as string).split(',');
    if (serviceTypes.length > 0) filters.serviceType = { $in: serviceTypes };
  }
  if (location && location !== 'All') filters.location = location as string;
  if (rating) filters['provider.rating'] = { $gte: Number(rating) };
  if (priceRange) {
    const [min, max] = (priceRange as string).split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filters.price = { $gte: min, $lte: max }; // Assuming 'price' is the general field to filter on
    }
  }
  filters.isActive = true; // Only fetch active services

  const sort: any = {};
  if (typeof sortBy === 'string' && typeof sortOrder === 'string') {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default sort
  }

  try {
    const count = await Service.countDocuments(filters);
    const services = await Service.find(filters)
      // .populate('provider.id', 'name email avatar verified rating reviewCount') // Already denormalized, but could populate if needed
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sort);

    res.json({
      services,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      if (service.isActive) { // Only increment views for active services
        service.views = (service.views || 0) + 1;
        await service.save();
      }
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error: any) {
    console.error('Error fetching service by ID:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Service not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (requires auth)
export const createService = async (req: Request, res: Response) => {
  const { title, description, price, hourlyRate, category, serviceType, availability, location, tags } = req.body;

  const user = req.user as IUser; // Type assertion after protect middleware
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const files = req.files as Express.Multer.File[];
  let imageUrls: string[] = [];

  try {
    if (files && files.length > 0 && process.env.CLOUDINARY_URL) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const imageUrl = await uploadToCloudinary(dataURI, 'services_images');
        imageUrls.push(imageUrl);
      }
    }

    const serviceData = {
      title,
      description,
      price: Number(price),
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      category,
      serviceType,
      availability,
      location,
      images: imageUrls,
      provider: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
        // rating and reviewCount will start at 0 or be managed by a separate review system
      },
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
      isActive: true, // Active by default
    };

    const service = new Service(serviceData);
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error: any) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server Error creating service', error: error.message });
  }
};

// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private (user must be provider or admin)
export const updateService = async (req: Request, res: Response) => {
  const { title, description, price, hourlyRate, category, serviceType, availability, location, tags, isActive, imagesToDelete, existingImages } = req.body;

  const user = req.user as IUser;
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this service' });
    }

    let updatedImageUrls: string[] = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : service.images;

    if (imagesToDelete && process.env.CLOUDINARY_URL) {
      const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
      for (const imageUrl of imagesToDeleteArray) {
        try { await deleteFromCloudinary(imageUrl); updatedImageUrls = updatedImageUrls.filter(img => img !== imageUrl); }
        catch (delError) { console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, delError); }
      }
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0 && process.env.CLOUDINARY_URL) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const newImageUrl = await uploadToCloudinary(dataURI, 'services_images');
        updatedImageUrls.push(newImageUrl);
      }
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price !== undefined ? Number(price) : service.price;
    service.hourlyRate = hourlyRate !== undefined ? Number(hourlyRate) : service.hourlyRate;
    service.category = category || service.category;
    service.serviceType = serviceType || service.serviceType;
    service.availability = availability || service.availability;
    service.location = location || service.location;
    service.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim())) : service.tags;
    service.isActive = isActive !== undefined ? Boolean(isActive) : service.isActive;
    service.images = updatedImageUrls;
    service.updatedAt = new Date();

    // Update provider info if it changed on the user model (e.g. name, avatar)
    // This assumes the user object on req.user is up-to-date.
    // This could also be handled by a separate process or when the user profile is updated.
    if (service.provider.id.toString() === user._id.toString()) {
        service.provider.name = user.name;
        service.provider.avatar = user.avatar;
        service.provider.verified = user.verified;
    }


    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error: any) {
    console.error('Error updating service:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Service not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error updating service', error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (user must be provider or admin)
export const deleteService = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this service' });
    }

    if (service.images && service.images.length > 0 && process.env.CLOUDINARY_URL) {
      for (const imageUrl of service.images) {
        try { await deleteFromCloudinary(imageUrl); }
        catch (delError) { console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, delError); }
      }
    }

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Service not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error deleting service', error: error.message });
  }
};

// @desc    Increment contact count for a service (e.g., when user requests contact info)
// @route   POST /api/services/:id/contact
// @access  Private
export const incrementServiceContactCount = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (!service.isActive) {
            return res.status(400).json({ message: 'Service is not active' });
        }

        service.contactCount = (service.contactCount || 0) + 1;
        await service.save();
        res.json({ message: 'Contact count updated', contactCount: service.contactCount });
    } catch (error: any) {
        console.error('Error incrementing service contact count:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
