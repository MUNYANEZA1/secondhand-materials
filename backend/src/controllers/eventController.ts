import { Request, Response } from 'express';
import Event, { IEvent } from '../models/EventModel';
import User from '../models/UserModel'; // For populating organizer/attendee info if needed and not denormalized
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import mongoose from 'mongoose';

// @desc    Fetch all events with filtering
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  const { search, category, status, type, sortBy = 'date', sortOrder = 'asc' } = req.query;
  const filters: any = {};

  if (search) {
    filters.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
      { tags: { $in: [(search as string).toLowerCase()] } }
    ];
  }
  if (category && category !== 'All') filters.category = category as string;
  if (status && status !== 'All') filters.status = status as string;
  if (type && type !== 'All') filters['ticketInfo.type'] = type as string;

  // Date filtering examples (more complex logic might be needed)
  // filters.date = { $gte: new Date() }; // Only upcoming by default, or pass date range

  const sort:any = {};
  if (typeof sortBy === 'string' && typeof sortOrder === 'string') {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.date = 1; // Default sort by date ascending
  }


  try {
    const events = await Event.find(filters)
        .populate('organizer.id', 'name email avatar') // Populate organizer user details
        .sort(sort);
    res.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
        .populate('organizer.id', 'name email avatar')
        .populate('attendees.userId', 'name email avatar'); // Populate attendees

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error: any) {
    console.error('Error fetching event by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (requires auth)
export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, time, location, category, organizerType, ticketType, ticketPrice, ticketCapacity, ticketMaxPerUser, tags } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const file = req.file as Express.Multer.File;
  if (!file) {
    return res.status(400).json({ message: 'Cover image is required' });
  }

  try {
    if (!process.env.CLOUDINARY_URL) {
      return res.status(500).json({ message: 'Cloudinary not configured. Cannot upload image.' });
    }
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    const coverImageUrl = await uploadToCloudinary(dataURI, 'events_covers');

    const eventData: Partial<IEvent> = {
      title,
      description,
      date: new Date(date),
      time,
      location,
      category,
      coverImage: coverImageUrl,
      organizer: {
        id: (req.user as any)._id,
        name: (req.user as any).name, // Denormalize user's name
        avatar: (req.user as any).avatar,
        verified: (req.user as any).verified,
        type: organizerType || 'user', // 'user', 'club', 'faculty' etc.
      },
      ticketInfo: {
        type: ticketType,
        price: ticketType === 'paid' ? Number(ticketPrice) : 0,
        capacity: Number(ticketCapacity),
        registered: 0,
        maxPerUser: Number(ticketMaxPerUser) || 1,
      },
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
      status: 'upcoming',
      attendees: []
    };

    const event = new Event(eventData);
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error: any) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server Error creating event', error: error.message });
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private (requires auth, user must be organizer or admin)
export const updateEvent = async (req: Request, res: Response) => {
  const { title, description, date, time, location, category, status, organizerType, ticketType, ticketPrice, ticketCapacity, ticketMaxPerUser, tags, coverImageToDelete } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.id.toString() !== (req.user as any)._id.toString() && (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this event' });
    }

    let coverImageUrl = event.coverImage;
    const file = req.file as Express.Multer.File;

    if (file && process.env.CLOUDINARY_URL) { // New image uploaded
      // Delete old image if it exists
      if (event.coverImage) {
        try { await deleteFromCloudinary(event.coverImage); }
        catch (e) { console.error("Error deleting old cover image", e); }
      }
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
      coverImageUrl = await uploadToCloudinary(dataURI, 'events_covers');
    } else if (coverImageToDelete && event.coverImage && process.env.CLOUDINARY_URL) { // Flag to delete, no new image
        try {
            await deleteFromCloudinary(event.coverImage);
            coverImageUrl = ''; // Set to empty or a default placeholder
        } catch(e) { console.error("Error deleting cover image by flag", e); }
    }


    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date ? new Date(date) : event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.category = category || event.category;
    event.status = status || event.status;
    event.coverImage = coverImageUrl;

    if ((req.user as any)._id.toString() === event.organizer.id.toString()) { // Allow organizer to update their details
        event.organizer.name = (req.user as any).name;
        event.organizer.avatar = (req.user as any).avatar;
        event.organizer.verified = (req.user as any).verified;
    }
    if (organizerType) event.organizer.type = organizerType;


    if (ticketType) event.ticketInfo.type = ticketType;
    if (ticketPrice !== undefined) event.ticketInfo.price = Number(ticketPrice);
    if (ticketCapacity !== undefined) event.ticketInfo.capacity = Number(ticketCapacity);
    if (ticketMaxPerUser !== undefined) event.ticketInfo.maxPerUser = Number(ticketMaxPerUser);

    event.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim())) : event.tags;
    event.updatedAt = new Date();

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error: any) {
    console.error('Error updating event:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error updating event', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (requires auth, user must be organizer or admin)
export const deleteEvent = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.id.toString() !== (req.user as any)._id.toString() && (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this event' });
    }

    if (event.coverImage && process.env.CLOUDINARY_URL) {
      try { await deleteFromCloudinary(event.coverImage); }
      catch (e) { console.error("Error deleting event cover image from Cloudinary", e); }
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error deleting event', error: error.message });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private (requires auth)
export const registerForEvent = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized. Please login to register.' });
  }

  try {
    const event = await Event.findById(req.params.id);
    const user = req.user as any; // from protect middleware

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.status !== 'upcoming') {
        return res.status(400).json({ message: 'Event is not upcoming, registration closed.' });
    }

    if (event.ticketInfo.registered >= event.ticketInfo.capacity) {
      return res.status(400).json({ message: 'Event is fully booked.' });
    }

    const existingRegistration = event.attendees.find(
      (att) => att.userId.toString() === user._id.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event.' });
    }

    // Check maxPerUser if needed - this logic is simple, could be more complex
    // For now, we assume maxPerUser is 1 as per typical frontend slice.
    // If maxPerUser > 1, the request body should contain quantity.

    event.attendees.push({
      userId: user._id,
      name: user.name,
      email: user.email,
      registrationDate: new Date(),
    });
    event.ticketInfo.registered += 1;

    await event.save();
    res.status(201).json({ message: 'Successfully registered for the event.', event });
  } catch (error: any) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Server Error registering for event', error: error.message });
  }
};

// @desc    Unregister from an event
// @route   DELETE /api/events/:id/unregister
// @access  Private (requires auth)
export const unregisterFromEvent = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized.' });
  }
  try {
    const event = await Event.findById(req.params.id);
    const user = req.user as any;

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
     if (event.status !== 'upcoming') {
        // Potentially allow unregistering from ongoing events too, depending on policy
        return res.status(400).json({ message: 'Cannot unregister from an event that is not upcoming.' });
    }

    const attendeeIndex = event.attendees.findIndex(
      (att) => att.userId.toString() === user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'Not registered for this event.' });
    }

    event.attendees.splice(attendeeIndex, 1);
    event.ticketInfo.registered -= 1;

    await event.save();
    res.json({ message: 'Successfully unregistered from the event.', event });
  } catch (error: any) {
    console.error('Error unregistering from event:', error);
    res.status(500).json({ message: 'Server Error unregistering from event', error: error.message });
  }
};
