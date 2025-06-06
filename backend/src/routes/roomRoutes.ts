import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomBookings
} from '../controllers/roomController';
import { protect, admin } from '../middleware/authMiddleware'; // admin for create/delete, manager for update
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getRooms) // Public, with filters for availability
  .post(protect, admin, upload.array('images', 5), createRoom); // Admin only

router.route('/:id')
  .get(getRoomById) // Public
  .put(protect, upload.array('newImages', 5), updateRoom) // Admin or Room Manager (logic in controller)
  .delete(protect, admin, deleteRoom); // Admin only

router.route('/:id/bookings')
    .get(protect, getRoomBookings); // Admin or Room Manager for that room

export default router;
