import asyncHandler from '../middleware/asyncHandler';
import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    avatar,
    studentId,
    university,
    major,
    graduationYear,
    businessName,
    businessType,
    businessLicense,
    location,
    contactNumber,
    bio,
    // socialMedia is an object, handle accordingly if passed in registration
  } = req.body;

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
      role,   // Optional, defaults to 'student' as per new schema
      studentId,
      university,
      major,
      graduationYear,
      businessName,
      businessType,
      businessLicense,
      location,
      contactNumber,
      bio,
      // socialMedia, // If you expect it during registration
    } as IUser); // Cast to IUser to ensure type safety with optional fields

    if (user) {
      // Return all relevant fields from the user model
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        studentId: user.studentId,
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear,
        businessName: user.businessName,
        businessType: user.businessType,
        businessLicense: user.businessLicense,
        location: user.location,
        contactNumber: user.contactNumber,
        bio: user.bio,
        socialMedia: user.socialMedia,
        totalSales: user.totalSales,
        totalPurchases: user.totalPurchases,
        lastActive: user.lastActive,
        verificationLevel: user.verificationLevel,
        trustScore: user.trustScore,
        badges: user.badges,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
        studentId: user.studentId,
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear,
        businessName: user.businessName,
        businessType: user.businessType,
        businessLicense: user.businessLicense,
        location: user.location,
        contactNumber: user.contactNumber,
        bio: user.bio,
        socialMedia: user.socialMedia,
        totalSales: user.totalSales,
        totalPurchases: user.totalPurchases,
        lastActive: user.lastActive,
        verificationLevel: user.verificationLevel,
        trustScore: user.trustScore,
        badges: user.badges,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  // This will be protected by authMiddleware, so req.user should be available
  const user = await User.findById((req as any).user._id); // req.user is populated by authMiddleware

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      studentId: user.studentId,
      university: user.university,
      major: user.major,
      graduationYear: user.graduationYear,
      businessName: user.businessName,
      businessType: user.businessType,
      businessLicense: user.businessLicense,
      location: user.location,
      contactNumber: user.contactNumber,
      bio: user.bio,
      socialMedia: user.socialMedia,
      totalSales: user.totalSales,
      totalPurchases: user.totalPurchases,
      lastActive: user.lastActive,
      verificationLevel: user.verificationLevel,
      trustScore: user.trustScore,
      badges: user.badges,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Do not send token here, it's not needed for profile fetch
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id); // req.user is populated by authMiddleware

  if (user) {
    // Update general fields
    user.name = req.body.name || user.name;
    user.location = req.body.location || user.location;
    user.contactNumber = req.body.contactNumber || user.contactNumber;
    user.bio = req.body.bio || user.bio;
    if (req.body.socialMedia) {
      user.socialMedia = { ...user.socialMedia, ...req.body.socialMedia };
    }

    // Update role-specific fields
    if (user.role === 'student') {
      user.university = req.body.university || user.university;
      user.major = req.body.major || user.major;
      user.graduationYear = req.body.graduationYear || user.graduationYear;
      user.studentId = req.body.studentId || user.studentId; // Assuming studentId can be updated
    } else if (user.role === 'vendor') {
      user.businessName = req.body.businessName || user.businessName;
      user.businessType = req.body.businessType || user.businessType;
      user.businessLicense = req.body.businessLicense || user.businessLicense; // Assuming license can be updated
    }

    // Potentially updatable fields (handle with care, especially role changes)
    // user.email = req.body.email || user.email; // Email change needs re-verification
    // user.role = req.body.role || user.role; // Role change might need admin approval or specific logic

    // Fields not typically updated by user directly here:
    // totalSales, totalPurchases, lastActive, verificationLevel, trustScore, badges

    if (req.body.password) {
      user.password = req.body.password; // Password change will be hashed by pre-save hook
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      studentId: updatedUser.studentId,
      university: updatedUser.university,
      major: updatedUser.major,
      graduationYear: updatedUser.graduationYear,
      businessName: updatedUser.businessName,
      businessType: updatedUser.businessType,
      businessLicense: updatedUser.businessLicense,
      location: updatedUser.location,
      contactNumber: updatedUser.contactNumber,
      bio: updatedUser.bio,
      socialMedia: updatedUser.socialMedia,
      totalSales: updatedUser.totalSales,
      totalPurchases: updatedUser.totalPurchases,
      lastActive: updatedUser.lastActive, // Should be updated automatically
      verificationLevel: updatedUser.verificationLevel,
      trustScore: updatedUser.trustScore,
      badges: updatedUser.badges,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      token: generateToken(updatedUser._id.toString()), // Re-issue token if sensitive info changed (e.g. role, though not handled here)
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
// @access  Private (Requires authMiddleware and uploadMiddleware)
export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // Assuming uploadMiddleware (e.g., using Multer and Cloudinary)
  // has processed the file and req.file.path contains the Cloudinary URL
  user.avatar = req.file.path;
  await user.save();

  res.json({
    message: 'Avatar uploaded successfully',
    avatarUrl: user.avatar,
    user: { // Return updated user object or relevant parts
      _id: user._id,
      avatar: user.avatar,
      // Potentially other fields if they are affected or need to be returned
    }
  });
});
