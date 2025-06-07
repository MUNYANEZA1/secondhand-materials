import express from 'express';
import { protect } from '../middleware/authMiddleware'; // Assuming authMiddleware is in this path
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:itemId') // itemId here will be the Product's ID in the cart
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

export default router;
