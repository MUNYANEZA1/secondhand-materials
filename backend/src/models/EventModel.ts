import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date; // Changed to Date type for better querying
  time: string; // Keep as string for flexibility e.g., "6:00 PM - 9:00 PM"
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  coverImage: string; // Cloudinary URL
  organizer: {
    id: mongoose.Schema.Types.ObjectId | Record<string, unknown>; // Can be a User or a specific Organizer entity if created later
    name: string; // Denormalized for easy display, or could be populated
    avatar?: string;
    verified: boolean;
    type: 'student' | 'faculty' | 'club' | 'organization' | 'user'; // Added 'user'
  };
  ticketInfo: {
    type: 'free' | 'paid';
    price?: number;
    capacity: number;
    registered: number;
    maxPerUser: number;
  };
  tags: string[];
  attendees: Array<{
    userId: mongoose.Schema.Types.ObjectId;
    name: string; // Denormalized
    email: string; // Denormalized
    registrationDate: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    coverImage: { type: String, required: true }, // URL from Cloudinary
    organizer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming organizers are users for now
      name: { type: String, required: true }, // Store organizer's name directly
      avatar: { type: String },
      verified: { type: Boolean, default: false }, // Could be linked to user's verification
      type: {
        type: String,
        enum: ['student', 'faculty', 'club', 'organization', 'user'],
        required: true,
        default: 'user',
      },
    },
    ticketInfo: {
      type: { type: String, enum: ['free', 'paid'], required: true },
      price: { type: Number, default: 0, min: 0 },
      capacity: { type: Number, required: true, min: 0 },
      registered: { type: Number, default: 0, min: 0 },
      maxPerUser: {type: Number, default: 1, min: 1 },
    },
    tags: [{ type: String, trim: true }],
    attendees: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        registrationDate: { type: Date, default: Date.now },
        _id: false, // No separate _id for attendees subdocuments by default
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for searching and filtering
eventSchema.index({ title: 'text', description: 'text', category: 1, date: 1, location: 1 });

// Virtual for remaining capacity
eventSchema.virtual('ticketInfo.remainingCapacity').get(function() {
  return this.ticketInfo.capacity - this.ticketInfo.registered;
});

// Ensure registered count does not exceed capacity (can also be done in controller)
eventSchema.pre('save', function(next) {
  if (this.ticketInfo.registered > this.ticketInfo.capacity) {
    this.ticketInfo.registered = this.ticketInfo.capacity;
    // Or throw an error: return next(new Error('Registered users exceed capacity.'));
  }
  next();
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
