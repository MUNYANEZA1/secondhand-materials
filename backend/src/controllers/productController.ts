import asyncHandler from '../middleware/asyncHandler';
import { Request, Response, NextFunction } from 'express'; // Added NextFunction
import Product, { IProduct } from '../models/ProductModel';
import User from '../models/UserModel'; // To populate seller info
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary'; // Assuming this is correctly set up
import fs from 'fs'; // For temporary file handling if using disk storage with multer

// @desc    Fetch all products with filtering, pagination, search
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
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
    // Use regex for case-insensitive partial matching for location
    filters.location = { $regex: req.query.location as string, $options: 'i' };
  }
  if (req.query.ownerType) {
    filters.ownerType = req.query.ownerType as string;
  }
  if (req.query.staffOnly !== undefined) {
    filters.staffOnly = req.query.staffOnly === 'true';
  }
  if (req.query.isFree !== undefined) {
    filters.isFree = req.query.isFree === 'true';
  }
  // Potentially more filters like sellerId, tags etc.

  const sortOptions: any = {};
  const sortBy = req.query.sortBy as string;
  if (sortBy === 'newest') sortOptions.createdAt = -1;
  else if (sortBy === 'oldest') sortOptions.createdAt = 1;
  else if (sortBy === 'price-low') sortOptions.price = 1;
  else if (sortBy === 'price-high') sortOptions.price = -1;
  else if (sortBy === 'popular') sortOptions.likes = -1; // Sort by likes for "popular"
  else if (sortBy === 'views') sortOptions.views = -1; // Optional: sort by views
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
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
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
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (requires auth)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, price, condition, category, subcategory, location, tags, isFree, ownerType, staffOnly } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found in request' });
  }

  // Simplified category validation
  const allowedCategories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Stationery', 'Services', 'Other'];
  let validatedCategory = category;
  if (category && !allowedCategories.includes(category)) {
    // Option 1: Return error
    // return res.status(400).json({ message: `Invalid category. Allowed categories are: ${allowedCategories.join(', ')}` });
    // Option 2: Assign a default category (e.g., 'Other') or handle as per preference
    console.warn(`Invalid category "${category}" provided. Defaulting to "Other".`);
    validatedCategory = 'Other';
  }
  if (!category) { // If category is not provided, default to 'Other'
    validatedCategory = 'Other';
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
      const b64 = Buffer.from(file.buffer).toString('base64');
      let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
      const imageUrl = await uploadToCloudinary(dataURI, 'products');
      imageUrls.push(imageUrl);
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ message: 'Invalid price format.' });
    }

    const parsedIsFree = typeof isFree === 'string' ? isFree.toLowerCase() === 'true' : Boolean(isFree);

    const product = new Product({
      title,
      description,
      price: parsedPrice,
      condition,
      category: validatedCategory,
      subcategory,
      images: imageUrls,
      seller: (req.user as any)._id, // From auth middleware
      location,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
      isFree: parsedIsFree,
      isActive: true, // Default
      ownerType,
      staffOnly: typeof staffOnly === 'string' ? staffOnly.toLowerCase() === 'true' : Boolean(staffOnly)
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error creating product', error: error.message });
  }
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (requires auth, and user must be seller or admin)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, price, condition, category, subcategory, location, tags, isFree, isActive, ownerType, staffOnly, imagesToDelete, existingImages } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== (req.user as any)._id.toString() && (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this product' });
    }

    let updatedImageUrls: string[] = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : product.images;

    if (imagesToDelete && process.env.CLOUDINARY_URL) {
      const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
      for (const imageUrl of imagesToDeleteArray) {
        try {
          await deleteFromCloudinary(imageUrl);
          updatedImageUrls = updatedImageUrls.filter(img => img !== imageUrl);
        } catch (delError) {
          console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, delError);
        }
      }
    }

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

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ message: 'Invalid price format.' });
      }
      product.price = parsedPrice;
    }

    product.condition = condition || product.condition;

    if (category) {
      const allowedCategories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Stationery', 'Services', 'Other'];
      if (!allowedCategories.includes(category)) {
        console.warn(`Invalid category "${category}" provided during update. Defaulting to "Other".`);
        product.category = 'Other';
      } else {
        product.category = category;
      }
    }

    product.subcategory = subcategory || product.subcategory;
    product.location = location || product.location;

    if (tags) {
        product.tags = Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim());
    }

    if (isFree !== undefined) {
        product.isFree = typeof isFree === 'string' ? isFree.toLowerCase() === 'true' : Boolean(isFree);
    }
    if (isActive !== undefined) {
        product.isActive = typeof isActive === 'string' ? isActive.toLowerCase() === 'true' : Boolean(isActive);
    }
    if (ownerType) {
        product.ownerType = ownerType;
    }
    if (staffOnly !== undefined) {
        product.staffOnly = typeof staffOnly === 'string' ? staffOnly.toLowerCase() === 'true' : Boolean(staffOnly);
    }

    product.images = updatedImageUrls;

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
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
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

    if (product.images && product.images.length > 0 && process.env.CLOUDINARY_URL) {
      for (const imageUrl of product.images) {
        try {
          await deleteFromCloudinary(imageUrl);
        } catch (delError) {
          console.error(`Failed to delete image ${imageUrl} from Cloudinary during product deletion:`, delError);
        }
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error deleting product', error: error.message });
  }
};

// @desc    Like a product
// @route   POST /api/products/:id/like
// @access  Private (requires auth)
export const likeProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // For now, simple increment. A more robust solution would track user likes.
  product.likes = (product.likes || 0) + 1;
  await product.save();

  res.json({
    message: 'Product liked successfully',
    likes: product.likes,
    productId: product._id,
  });
});

// @desc    Unlike a product (Optional)
// @route   DELETE /api/products/:id/like
// @access  Private (requires auth)
// export const unlikeProduct = asyncHandler(async (req: Request, res: Response) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   product.likes = Math.max(0, (product.likes || 0) - 1); // Ensure likes don't go below 0
//   await product.save();

//   res.json({
//     message: 'Product unliked successfully',
//     likes: product.likes,
//     productId: product._id,
//   });
// });
