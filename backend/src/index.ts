import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

// Connect to Database
connectDB();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);

import productRoutes from './routes/productRoutes';
app.use('/api/products', productRoutes);

import eventRoutes from './routes/eventRoutes';
app.use('/api/events', eventRoutes);

import serviceRoutes from './routes/serviceRoutes';
app.use('/api/services', serviceRoutes);

import roomRoutes from './routes/roomRoutes';
app.use('/api/rooms', roomRoutes);

import bookingRoutes from './routes/bookingRoutes';
app.use('/api/bookings', bookingRoutes);

import rideRoutes from './routes/rideRoutes';
app.use('/api/rides', rideRoutes);

import resourceRoutes from './routes/resourceRoutes';
app.use('/api/resources', resourceRoutes);

import chatRoutes from './routes/chatRoutes';
app.use('/api/chat', chatRoutes);

// Basic Route (Keep this before notFound middleware)
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the INES Platform API!' });
});

// Error Handling Middleware (must be last, after all routes)
app.use(notFound); // Handles 404 errors for routes not found
app.use(errorHandler); // Handles all other errors

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
