import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET not found in .env. Please add it.');
    throw new Error('JWT secret not configured');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d', // Expires in 30 days
  });
};

export default generateToken;
