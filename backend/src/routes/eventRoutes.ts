import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../controllers/eventController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware'; // For cover image

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, upload.single('coverImage'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, upload.single('coverImage'), updateEvent) // admin or organizer
  .delete(protect, deleteEvent); // admin or organizer

router.route('/:id/register')
  .post(protect, registerForEvent);

router.route('/:id/unregister')
  .delete(protect, unregisterFromEvent);

export default router;
