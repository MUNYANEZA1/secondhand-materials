import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

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

import chatRoutes from './routes/chatRoutes'; // Added Chat Routes
app.use('/api/chat', chatRoutes);         // Added Chat Routes

// Basic Route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the INES Platform API!' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

// For real-time chat, you would integrate Socket.IO here
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// const server = http.createServer(app);
// const io = new SocketIOServer(server, { cors: { origin: "*" }}); // Configure CORS for Socket.IO
// global.io = io; // Make io accessible in controllers (not ideal, consider dependency injection)
// io.on('connection', (socket) => {
//   console.log('A user connected to Socket.IO:', socket.id);
//   // Handle chat events, joining rooms (conversations), etc.
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });
// server.listen(port, () => {
//   console.log(`Server (with Socket.IO) is running on http://localhost:${port}`);
// });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


export default app;
