import asyncHandler from '../middleware/asyncHandler';
import { Request, Response } from 'express';
import Cart, { ICart, ICartItem } from '../models/CartModel';
import Product from '../models/ProductModel'; // To fetch product details

// @desc    Get user's cart or create one if it doesn't exist
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  let cart = await Cart.findOne({ user: (req.user as any)._id }).populate({
    path: 'items.product', // Populate product details within items
    select: 'name images price stockInfo', // Select specific fields you need, stockInfo if you have it
  });

  if (!cart) {
    // If no cart exists for the user, create a new one
    cart = await Cart.create({ user: (req.user as any)._id, items: [] });
  }

  // Ensure item subdocuments also get populated if not deeply handled by Mongoose
  // This step might be redundant if .populate above works as expected for subdocument fields like name, image, price
  // However, we store these at the time of adding to cart, so direct population of 'product' ref is more for cross-checking.
  // For the stored name, image, price on cartItem, direct access is fine.

  res.status(200).json(cart);
});

// @desc    Add an item to the cart or update quantity if it exists
// @route   POST /api/cart/items
// @access  Private
export const addItemToCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { productId, quantity } = req.body;
  const userId = (req.user as any)._id;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid productId or quantity' });
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: 'Product not found or not available' });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Item exists, update quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Item does not exist, add new item
    // Ensure product.images[0] exists or handle missing image
    const cartItem: Partial<ICartItem> = { // Use Partial as _id is not defined yet
      product: product._id,
      name: product.title, // Assuming 'title' is the name field in ProductModel
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png', // Default placeholder
      price: product.price, // Price at the time of adding
      quantity: quantity,
    };
    cart.items.push(cartItem as ICartItem);
  }

  await cart.save();
  // Repopulate to get product details in the response if needed, or just send the updated cart
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name images price',
  });
  res.status(200).json(updatedCart);
});

// @desc    Update quantity of an item in the cart
// @route   PUT /api/cart/items/:itemId (itemId is productId)
// @access  Private
export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { itemId: productId } = req.params;
  const { quantity } = req.body;
  const userId = (req.user as any)._id;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    // Optionally, re-verify product price if it can change and you want to update it (not typical for cart)
  }

  await cart.save();
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name images price',
  });
  res.status(200).json(updatedCart);
});

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/items/:itemId (itemId is productId)
// @access  Private
export const removeItemFromCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { itemId: productId } = req.params;
  const userId = (req.user as any)._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
    return res.status(404).json({ message: 'Item not found in cart to remove' });
  }

  await cart.save();
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name images price',
  });
  res.status(200).json(updatedCart);
});

// @desc    Clear all items from the cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const userId = (req.user as any)._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    // If no cart, can return success or a specific message
    return res.status(200).json({ message: 'Cart already empty or not found', items: [] });
  }

  cart.items = [];
  await cart.save();
  res.status(200).json(cart); // Returns the now empty cart
});
