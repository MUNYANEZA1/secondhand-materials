import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  recordDownload,
  rateResource,
  approveResource
} from '../controllers/resourceController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware'; // For file uploads

const router = express.Router();

router.route('/')
  .get(getResources) // Public (filtered) or Admin (all)
  .post(protect, upload.single('file'), createResource); // Authenticated users to upload

router.route('/:id')
  .get(getResourceById) // Public (if approved) or Private/Admin
  .put(protect, updateResource) // Uploader or Admin
  .delete(protect, deleteResource); // Uploader or Admin

router.route('/:id/download')
  .post(recordDownload); // Public or Private (if tracking user downloads)

router.route('/:id/rate')
  .post(protect, rateResource); // Authenticated users to rate

router.route('/:id/approve')
    .put(protect, admin, approveResource); // Admin only

export default router;
