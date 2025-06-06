import { Request, Response } from 'express';
import Room from '../models/RoomModel';
import Booking from '../models/BookingModel';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { IUser } from '../models/UserModel';

// @desc    Fetch all rooms with filtering
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req: Request, res: Response) => {
  const { search, building, type, capacity, date, startTime, endTime, amenities, equipment, status = 'available' } = req.query;
  const filters: any = { status }; // Default to available rooms

  if (search) {
    filters.$or = [
      { name: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
      { building: { $regex: search as string, $options: 'i' } },
    ];
  }
  if (building && building !== 'All') filters.building = building as string;
  if (type && type !== 'All') filters.type = type as string;
  if (capacity) filters.capacity = { $gte: Number(capacity) };
  if (amenities) filters.amenities = { $all: (amenities as string).split(',') };
  if (equipment) filters.equipment = { $all: (equipment as string).split(',') };

  filters.isBookable = true; // By default, only show bookable rooms for general queries

  try {
    let rooms = await Room.find(filters).populate('managedBy', 'name email');

    // If date, startTime, and endTime are provided, filter by availability
    if (date && startTime && endTime) {
      const requestedDate = new Date(date as string);
      const overlappingBookings = await Booking.find({
        date: requestedDate,
        status: { $in: ['confirmed', 'pending'] }, // Consider pending as booked for conflict checking
        $or: [
          // Case 1: Existing booking starts during requested slot
          { startTime: { $lt: endTime as string }, endTime: { $gt: startTime as string } },
        ],
      }).select('room'); // Select only room IDs

      const bookedRoomIds = overlappingBookings.map(b => b.room.toString());
      rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
    }

    res.json(rooms);
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id).populate('managedBy', 'name email');
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error: any) {
    console.error('Error fetching room by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Room not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an admin' });
  }
  const { name, description, building, floor, roomNumber, capacity, type, amenities, equipment, hourlyRate, isBookable, status, notes, managedBy } = req.body;
  const files = req.files as Express.Multer.File[];
  let imageUrls: string[] = [];

  try {
    if (files && files.length > 0 && process.env.CLOUDINARY_URL) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const imageUrl = await uploadToCloudinary(dataURI, 'rooms_images');
        imageUrls.push(imageUrl);
      }
    }
    const room = new Room({
      name, description, building, floor: Number(floor), roomNumber, capacity: Number(capacity), type,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((a:string)=>a.trim()) : []),
      equipment: Array.isArray(equipment) ? equipment : (equipment ? equipment.split(',').map((e:string)=>e.trim()) : []),
      images: imageUrls,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      isBookable: isBookable !== undefined ? Boolean(isBookable) : true,
      status: status || 'available',
      notes,
      managedBy: managedBy || undefined
    });
    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error: any) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Server Error creating room', error: error.message });
  }
};

// @desc    Update an existing room (Admin or Manager)
// @route   PUT /api/rooms/:id
// @access  Private/Admin or Private/Manager
export const updateRoom = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { name, description, building, floor, roomNumber, capacity, type, amenities, equipment, hourlyRate, isBookable, status, notes, managedBy, imagesToDelete, existingImages } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (user.role !== 'admin' && (!room.managedBy || room.managedBy.toString() !== user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    let updatedImageUrls: string[] = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : room.images;

    if (imagesToDelete && process.env.CLOUDINARY_URL) {
      const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
      for (const imageUrl of imagesToDeleteArray) {
        try { await deleteFromCloudinary(imageUrl); updatedImageUrls = updatedImageUrls.filter(img => img !== imageUrl); }
        catch (delError) { console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, delError); }
      }
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0 && process.env.CLOUDINARY_URL) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const newImageUrl = await uploadToCloudinary(dataURI, 'rooms_images');
        updatedImageUrls.push(newImageUrl);
      }
    }
    room.images = updatedImageUrls;

    room.name = name || room.name;
    room.description = description || room.description;
    // ... (update other fields similarly)
    if(building) room.building = building;
    if(floor) room.floor = Number(floor);
    if(roomNumber) room.roomNumber = roomNumber;
    if(capacity) room.capacity = Number(capacity);
    if(type) room.type = type;
    if(amenities) room.amenities = Array.isArray(amenities) ? amenities : amenities.split(',').map((a:string)=>a.trim());
    if(equipment) room.equipment = Array.isArray(equipment) ? equipment : equipment.split(',').map((e:string)=>e.trim());
    if(hourlyRate !== undefined) room.hourlyRate = Number(hourlyRate);
    if(isBookable !== undefined) room.isBookable = Boolean(isBookable);
    if(status) room.status = status;
    if(notes !== undefined) room.notes = notes;
    if(managedBy !== undefined) room.managedBy = managedBy || undefined;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error: any) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Server Error updating room', error: error.message });
  }
};

// @desc    Delete a room (Admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req: Request, res: Response) => {
  const user = req.user as IUser;
   if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an admin' });
  }
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Optionally, delete images from Cloudinary
    if (room.images && room.images.length > 0 && process.env.CLOUDINARY_URL) {
      for (const imageUrl of room.images) {
        try { await deleteFromCloudinary(imageUrl); } catch (e) { console.error("Error deleting room image", e); }
      }
    }
    // Consider implications: what to do with existing bookings for this room?
    // Mark as inactive/deleted, or prevent deletion if active bookings exist.
    // For now, simple deletion.
    await Booking.deleteMany({ room: room._id }); // Delete associated bookings
    await room.deleteOne();
    res.json({ message: 'Room and associated bookings removed' });
  } catch (error: any) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Server Error deleting room', error: error.message });
  }
};

// @desc    Get bookings for a specific room (Admin or Manager)
// @route   GET /api/rooms/:id/bookings
// @access  Private/Admin or Private/Manager
export const getRoomBookings = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (user.role !== 'admin' && (!room.managedBy || room.managedBy.toString() !== user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to view these bookings' });
        }

        const bookings = await Booking.find({ room: req.params.id })
            .populate('user', 'name email')
            .sort({ date: 1, startTime: 1 });
        res.json(bookings);
    } catch (error: any) {
        console.error('Error fetching room bookings:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
