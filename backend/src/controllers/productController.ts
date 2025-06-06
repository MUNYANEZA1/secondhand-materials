import { Request, Response } from 'express';
import Product, { IProduct } from '../models/ProductModel';
import User from '../models/UserModel'; // To populate seller info
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary'; // Assuming this is correctly set up
import fs from 'fs'; // For temporary file handling if using disk storage with multer

// @desc    Fetch all products with filtering, pagination, search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.limit as string) || 12;
  const page = parseInt(req.query.page as string) || 1;
  const searchTerm = req.query.search ? {
    $or: [
      { title: { $regex: req.query.search as string, $options: 'i' } },
      { description: { $regex: req.query.search as string, $options: 'i' } },
      { category: { $regex: req.query.search as string, $options: 'i' } },
      { tags: { $in: [(req.query.search as string).toLowerCase()] } }
    ]
  } : {};

  const filters: any = {};
  if (req.query.category && req.query.category !== 'All') {
    filters.category = req.query.category as string;
  }
  if (req.query.condition) {
    const conditions = (req.query.condition as string).split(',');
    if (conditions.length > 0) {
        filters.condition = { $in: conditions };
    }
  }
  if (req.query.priceRange) {
    const [min, max] = (req.query.priceRange as string).split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filters.price = { $gte: min, $lte: max };
    }
  }
   if (req.query.location) {
    filters.location = { $regex: req.query.location as string, $options: 'i' };
  }
  // Add more filters as needed from frontend: isFree, ownerType, staffOnly

  const sortOptions: any = {};
  const sortBy = req.query.sortBy as string;
  if (sortBy === 'newest') sortOptions.createdAt = -1;
  else if (sortBy === 'oldest') sortOptions.createdAt = 1;
  else if (sortBy === 'price-low') sortOptions.price = 1;
  else if (sortBy === 'price-high') sortOptions.price = -1;
  // else if (sortBy === 'popular') sortOptions.likes = -1; // or views
  else sortOptions.createdAt = -1; // Default sort

  try {
    const query = { ...searchTerm, ...filters };
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name avatar reputation verified') // Populate seller info
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortOptions);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email avatar reputation verified');
    if (product) {
      product.views = (product.views || 0) + 1; // Increment views
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error('Error fetching product by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (requires auth)
export const createProduct = async (req: Request, res: Response) => {
  const { title, description, price, condition, category, subcategory, location, tags, isFree, ownerType, staffOnly } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found in request' });
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    if (!process.env.CLOUDINARY_URL) {
      return res.status(500).json({ message: 'Cloudinary not configured. Cannot upload images.' });
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      // If using diskStorage, file.path would be used. For memoryStorage, we need to handle the buffer.
      // For memoryStorage, we need a way to pass the buffer to uploadToCloudinary.
      // A common pattern for memoryStorage is to convert buffer to Data URI.
      const b64 = Buffer.from(file.buffer).toString('base64');
      let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
      const imageUrl = await uploadToCloudinary(dataURI, 'products');
      imageUrls.push(imageUrl);
    }

    const product = new Product({
      title,
      description,
      price: Number(price),
      condition,
      category,
      subcategory,
      images: imageUrls,
      seller: (req.user as any)._id, // From auth middleware
      location,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
      isFree: Boolean(isFree),
      isActive: true, // Default
      ownerType,
      staffOnly: Boolean(staffOnly)
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error creating product', error: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (requires auth, and user must be seller or admin)
export const updateProduct = async (req: Request, res: Response) => {
  const { title, description, price, condition, category, subcategory, location, tags, isFree, isActive, ownerType, staffOnly, imagesToDelete, existingImages } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the logged-in user is the seller or an admin
    if (product.seller.toString() !== (req.user as any)._id.toString() && (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this product' });
    }

    let updatedImageUrls: string[] = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : product.images;

    // Delete images marked for deletion from Cloudinary
    if (imagesToDelete && process.env.CLOUDINARY_URL) {
      const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
      for (const imageUrl of imagesToDeleteArray) {
        try {
          await deleteFromCloudinary(imageUrl);
          updatedImageUrls = updatedImageUrls.filter(img => img !== imageUrl);
        } catch (delError) {
          console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, delError);
          // Optionally, decide if this should halt the update or just log
        }
      }
    }

    // Upload new images if any
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0 && process.env.CLOUDINARY_URL) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const newImageUrl = await uploadToCloudinary(dataURI, 'products');
        updatedImageUrls.push(newImageUrl);
      }
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.condition = condition || product.condition;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.location = location || product.location;
    product.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim())) : product.tags;
    product.isFree = isFree !== undefined ? Boolean(isFree) : product.isFree;
    product.isActive = isActive !== undefined ? Boolean(isActive) : product.isActive;
    product.ownerType = ownerType || product.ownerType;
    product.staffOnly = staffOnly !== undefined ? Boolean(staffOnly) : product.staffOnly;
    product.images = updatedImageUrls;
    product.updatedAt = new Date();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error updating product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (requires auth, and user must be seller or admin)
export const deleteProduct = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== (req.user as any)._id.toString() && (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this product' });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0 && process.env.CLOUDINARY_URL) {
      for (const imageUrl of product.images) {
        try {
          await deleteFromCloudinary(imageUrl);
        } catch (delError) {
          console.error(`Failed to delete image ${imageUrl} from Cloudinary during product deletion:`, delError);
          // Optionally, log this and continue with DB deletion
        }
      }
    }

    await product.deleteOne(); // Mongoose v6+
    // For older Mongoose: await Product.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error deleting product', error: error.message });
  }
};
