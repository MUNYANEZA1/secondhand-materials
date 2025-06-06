import { Request, Response } from 'express';
import Booking from '../models/BookingModel';
import Room from '../models/RoomModel'; // To check room status and capacity
import { IUser } from '../models/UserModel'; // For req.user type

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { room: roomId, eventName, description, date, startTime, endTime, attendees } = req.body;

  if (!roomId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Room, date, start time, and end time are required' });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.isBookable || room.status !== 'available') {
      return res.status(400).json({ message: 'This room is currently not bookable or available' });
    }
    if (attendees && Number(attendees) > room.capacity) {
      return res.status(400).json({ message: `Number of attendees (${attendees}) exceeds room capacity (${room.capacity})` });
    }

    // Check for overlapping bookings for the same room
    const requestedDate = new Date(date);
    const overlappingBookings = await Booking.find({
      room: roomId,
      date: requestedDate,
      status: { $in: ['confirmed', 'pending'] }, // Check against confirmed and pending
      $or: [
        // Existing booking starts during new booking
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: 'Time slot unavailable. The room is already booked for the requested time.' });
    }

    const booking = new Booking({
      room: roomId,
      user: user._id,
      eventName,
      description,
      date: requestedDate,
      startTime,
      endTime,
      attendees: attendees ? Number(attendees) : undefined,
      status: 'pending', // Default status, can be changed by admin/manager
    });

    const createdBooking = await booking.save();
    // TODO: Notify admin/room manager if approval is needed
    res.status(201).json(createdBooking);
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server Error creating booking', error: error.message });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const bookings = await Booking.find({ user: user._id })
      .populate('room', 'name building roomNumber images') // Populate some room details
      .sort({ date: -1, startTime: -1 });
    res.json(bookings);
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (user must be owner or admin/manager)
export const getBookingById = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const booking = await Booking.findById(req.params.id).populate('room').populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if user is owner or admin. Room manager check is more complex here.
    // For simplicity, owner or admin.
    if (booking.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      // Check if user manages the room for this booking (if room populated managedBy)
      // const roomDetails = booking.room as any; (if populated)
      // if(!roomDetails.managedBy || roomDetails.managedBy.toString() !== user._id.toString()){
      //    return res.status(403).json({ message: 'Not authorized to view this booking' });
      // }
       return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    res.json(booking);
  } catch (error: any) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update booking status (Admin or Room Manager) or cancel (User)
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { status, notes } = req.body; // User can only update status to 'cancelled'

  try {
    const booking = await Booking.findById(req.params.id).populate('room'); // Populate room to check manager
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const roomDetails = booking.room as any; // IRoom (assuming populated)

    // User cancelling their own booking
    if (status === 'cancelled' && booking.user.toString() === user._id.toString()) {
      if (booking.status === 'confirmed' || booking.status === 'pending') {
        booking.status = 'cancelled';
        booking.notes = notes || booking.notes; // User can add a cancellation note
      } else {
        return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}` });
      }
    }
    // Admin or Room Manager updating status
    else if (user.role === 'admin' || (roomDetails && roomDetails.managedBy && roomDetails.managedBy.toString() === user._id.toString())) {
      if (!status) return res.status(400).json({ message: "Status is required for update by manager/admin."});
      booking.status = status;
      booking.notes = notes || booking.notes;
      if (status === 'confirmed') {
        booking.approvedBy = user._id;
      }
    }
    // Not authorized for other updates
    else {
      return res.status(403).json({ message: 'Not authorized to update this booking status' });
    }

    const updatedBooking = await booking.save();
    // TODO: Notify user of status change
    res.json(updatedBooking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server Error updating booking', error: error.message });
  }
};

// @desc    Delete a booking (Admin only, generally bookings should be cancelled)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server Error deleting booking', error: error.message });
  }
};

// @desc    Get all bookings (Admin or specific managers)
// @route   GET /api/bookings
// @access  Private/Admin or Private/Manager
export const getAllBookings = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { room, status, date, page = 1, limit = 20 } = req.query;
    const queryFilters: any = {};

    if (user.role !== 'admin') {
        // If not admin, assume manager and filter by rooms they manage
        const managedRooms = await Room.find({ managedBy: user._id }).select('_id');
        const managedRoomIds = managedRooms.map(r => r._id);
        if (managedRoomIds.length === 0) {
            return res.json({ bookings: [], page:1, pages:0, total:0 }); // No rooms managed
        }
        queryFilters.room = { $in: managedRoomIds };
    }

    if (room) queryFilters.room = room;
    if (status) queryFilters.status = status;
    if (date) queryFilters.date = new Date(date as string);

    try {
        const count = await Booking.countDocuments(queryFilters);
        const bookings = await Booking.find(queryFilters)
            .populate('room', 'name building roomNumber')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        res.json({
            bookings,
            page: Number(page),
            pages: Math.ceil(count / Number(limit)),
            total: count
        });
    } catch (error: any) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
