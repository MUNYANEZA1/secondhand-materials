import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/UserModel'; // Assuming IUser is exported from UserModel
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Or a more specific User type without sensitive data
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET not found in .env. Auth middleware cannot function.');
    return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret) as { id: string };

      // Fetch user details but exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware for admin access
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
