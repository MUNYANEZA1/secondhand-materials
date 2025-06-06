import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  incrementServiceContactCount
} from '../controllers/serviceController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware'; // For service images

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, upload.array('images', 5), createService); // Max 5 images for a service

router.route('/:id')
  .get(getServiceById)
  .put(protect, upload.array('newImages', 5), updateService) // Provider or admin
  .delete(protect, deleteService); // Provider or admin

router.route('/:id/contact')
  .post(protect, incrementServiceContactCount); // Log when a user contacts/requests info for a service

export default router;
