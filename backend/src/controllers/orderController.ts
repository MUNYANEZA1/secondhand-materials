import asyncHandler from '../middleware/asyncHandler';
import { Request, Response } from 'express';
import Order, { IOrder, IOrderItem } from '../models/OrderModel';
import Cart from '../models/CartModel';
import Product from '../models/ProductModel'; // Not strictly needed if cart items have all details

// Predefined promo codes (in a real app, this might come from a DB or config)
const PROMO_CODES: { [key: string]: number } = {
  'STUDENT10': 10, // 10% discount
  'FIRST20': 20,   // 20% discount
  'FREESHIP': 0,   // Special case for free shipping, handled in logic
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const userId = (req.user as any)._id;
  const { paymentMethod, shippingAddress, promoCode } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  // Calculate itemsPrice from cart items
  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  let appliedPromoCode: string | undefined = undefined;

  // Promo Code Logic
  if (promoCode && PROMO_CODES.hasOwnProperty(promoCode)) {
    appliedPromoCode = promoCode;
    const discountPercentage = PROMO_CODES[promoCode];
    if (promoCode === 'FREESHIP') {
      // Free shipping handled later by setting shippingPrice to 0
      // No percentage discount for FREESHIP itself
    } else if (discountPercentage > 0) {
      discountAmount = (itemsPrice * discountPercentage) / 100;
    }
  }

  // Shipping Price Logic (example: free shipping for orders over $50 or if FREESHIP promo applied)
  let shippingPrice = 10; // Default shipping cost
  if (itemsPrice > 50 || promoCode === 'FREESHIP') {
    shippingPrice = 0;
  }

  // Tax Price (can be zero for now or a fixed percentage if needed)
  const taxPrice = 0; // Example: (itemsPrice - discountAmount) * 0.05; // 5% tax

  const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

  // Transform cart items to order items
  const orderItems: IOrderItem[] = cart.items.map(item => ({
    product: item.product,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
  } as IOrderItem)); // Cast to IOrderItem, _id will be handled by Mongoose

  const order = new Order({
    user: userId,
    items: orderItems,
    shippingAddress: shippingAddress || {}, // Default to empty object if not provided
    paymentMethod,
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    promoCodeApplied: appliedPromoCode,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    status: 'PendingPayment', // Initial status
  });

  const createdOrder = await order.save();

  // Optional: Clear the cart after successful order creation
  // Consider if this should be immediate or after payment confirmation
  // For now, let's clear it.
  // cart.items = [];
  // await cart.save();
  // A better approach for clearing cart might be a separate call or based on payment status.
  // For this task, we'll clear it directly as per the (Optional: Clear the cart...) note.
  await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });


  res.status(201).json(createdOrder);
});
