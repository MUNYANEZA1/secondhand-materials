import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createOrder,
  // getOrderById, (To be implemented later)
  // getUserOrders, (To be implemented later)
  // updateOrderStatus, (To be implemented later by admin)
} from '../controllers/orderController';

const router = express.Router();

// All order routes are protected
router.use(protect);

router.route('/')
  .post(createOrder);
  // .get(getUserOrders); // For users to get their own orders

// Example for specific order by ID (for user or admin)
// router.route('/:id')
//   .get(getOrderById);

// Example for admin to update order status
// router.route('/:id/status')
//   .put(admin, updateOrderStatus); // Assuming 'admin' middleware for admin checks

export default router;
