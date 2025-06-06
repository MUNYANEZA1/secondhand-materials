import asyncHandler from '../middleware/asyncHandler';
import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar, // Optional
      role,   // Optional, defaults to 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        verified: user.verified,
        reputation: user.reputation,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        verified: user.verified,
        reputation: user.reputation,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// export const getUserProfile = async (req: Request, res: Response) => {
//   // This will be protected by authMiddleware, so req.user should be available
//   // const user = await User.findById((req as any).user._id);
//   // if (user) {
//   //   res.json({
//   //     _id: user._id,
//   //     name: user.name,
//   //     email: user.email,
//   //     avatar: user.avatar,
//   //     role: user.role,
//   //   });
//   // } else {
//   //   res.status(404).json({ message: 'User not found' });
//   // }
//   res.status(501).json({message: "Profile endpoint not fully implemented yet"});
// };
