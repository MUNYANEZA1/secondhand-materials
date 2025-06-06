import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking, // Handles user cancellation and admin/manager status updates
  deleteBooking,
  getAllBookings
} from '../controllers/bookingController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getAllBookings); // Admin or specific managers (logic in controller)

router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById) // User (own) or Admin/Manager
  .put(protect, updateBooking)   // User (cancel own) or Admin/Manager (update status)
  .delete(protect, admin, deleteBooking); // Admin only

export default router;
