import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '../controllers/authController';
import { registerUserValidationRules, validateRequest } from '../middleware/validationMiddleware';
import { protect } from '../middleware/authMiddleware'; // Assuming this exists
import { upload } from '../middleware/uploadMiddleware'; // Assuming this exists for avatar uploads

const router = express.Router();

router.post('/register', registerUserValidationRules(), validateRequest, registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar); // Assuming 'avatar' is the field name for the file

export default router;
