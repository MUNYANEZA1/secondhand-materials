import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController'; // Ensure controller path is correct
import { protect } from '../middleware/authMiddleware'; // Ensure auth middleware path is correct

const router = express.Router();

// All wishlist routes are protected
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:productId')
  .delete(protect, removeFromWishlist);

// You can add other user-specific routes here later, for example:
// router.route('/profile').get(protect, getUserProfileFromAuthController); // if you move profile here
// router.route('/profile').put(protect, updateUserProfileFromAuthController); // if you move profile here

export default router;
