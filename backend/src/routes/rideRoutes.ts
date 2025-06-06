import express from 'express';
import {
  getRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
  bookSeatOnRide,
  manageRideBooking,
  cancelRideBooking
} from '../controllers/rideController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getRides) // Public
  .post(protect, createRide); // Authenticated users

router.route('/:id')
  .get(getRideById) // Public
  .put(protect, updateRide) // Ride owner or admin
  .delete(protect, deleteRide); // Ride owner or admin

router.route('/:id/book')
  .post(protect, bookSeatOnRide) // Authenticated user to book a seat
  .delete(protect, cancelRideBooking); // Authenticated user (passenger) to cancel their booking

router.route('/:id/manage-booking/:passengerId')
    .put(protect, manageRideBooking); // Ride owner to confirm/cancel a passenger's booking

export default router;
