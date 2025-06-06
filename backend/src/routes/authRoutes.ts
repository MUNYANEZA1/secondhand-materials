import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { registerUserValidationRules, validateRequest } from '../middleware/validationMiddleware';
// import { protect } from '../middleware/authMiddleware'; // Will be added later

const router = express.Router();

router.post('/register', registerUserValidationRules(), validateRequest, registerUser);
router.post('/login', loginUser);
// router.get('/profile', protect, getUserProfile); // Example of a protected route

export default router;
