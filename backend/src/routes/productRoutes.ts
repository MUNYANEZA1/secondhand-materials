import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  likeProduct, // Import likeProduct
  // unlikeProduct, // Import if implementing
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware'; // Assuming admin might be needed for some ops
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, upload.array('images', 10), createProduct); // Max 10 images

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.array('newImages', 10), updateProduct) // 'newImages' for clarity
  .delete(protect, deleteProduct);

router.route('/:id/like').post(protect, likeProduct);

// Add other product specific routes here if needed e.g., reviews etc.
// If unlikeProduct is implemented:
// router.route('/:id/like').delete(protect, unlikeProduct); // And import it


export default router;
