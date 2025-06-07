import asyncHandler from '../middleware/asyncHandler';
import { Request, Response } from 'express';
import User from '../models/UserModel';
import Product from '../models/ProductModel'; // For checking if product exists
import mongoose from 'mongoose';

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const userId = (req.user as any)._id;

  const userWithWishlist = await User.findById(userId).populate({
    path: 'wishlist',
    select: 'title price images category seller', // Select desired fields from Product
    populate: { // Further populate seller details if needed from Product's seller ref
        path: 'seller',
        select: 'name avatar' // Select seller fields you want to show in wishlist items
    }
  });

  if (!userWithWishlist) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(userWithWishlist.wishlist || []);
});

// @desc    Add a product to user's wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const userId = (req.user as any)._id;
  const { productId } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Valid Product ID is required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if product is already in wishlist
  if (user.wishlist.find(item => item.toString() === productId)) {
    return res.status(400).json({ message: 'Product already in wishlist' });
  }

  user.wishlist.push(new mongoose.Types.ObjectId(productId));
  await user.save();

  // Optionally, return the updated wishlist or just the added product ID
  res.status(200).json({ message: 'Product added to wishlist', productId });
});

// @desc    Remove a product from user's wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const userId = (req.user as any)._id;
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Valid Product ID is required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const initialLength = user.wishlist.length;
  user.wishlist = user.wishlist.filter(item => item.toString() !== productId);

  if (user.wishlist.length === initialLength) {
    return res.status(404).json({ message: 'Product not found in wishlist' });
  }

  await user.save();

  // Optionally, return the updated wishlist or just a success message
  res.status(200).json({ message: 'Product removed from wishlist' });
});
