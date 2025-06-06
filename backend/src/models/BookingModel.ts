import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  room: mongoose.Schema.Types.ObjectId; // Reference to Room model
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
  eventName?: string; // Optional name for the booking/event
  description?: string; // Optional description or purpose
  date: Date; // The specific date of the booking
  startTime: string; // e.g., "09:00" or "14:30" (24-hour format recommended for backend)
  endTime: string;   // e.g., "10:00" or "17:00"
  attendees?: number; // Number of attendees
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  notes?: string; // Notes from user or admin
  approvedBy?: mongoose.Schema.Types.ObjectId; // User ID of admin/manager who approved
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Consider storing as minutes from start of day or full ISO datetime
    endTime: { type: String, required: true },   // Consider storing as minutes from start of day or full ISO datetime
    attendees: { type: Number, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for querying bookings by room, user, and date
bookingSchema.index({ room: 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, date: 1, status: 1 });

// Ensure that start time is before end time (can also be done in controller)
bookingSchema.pre('save', function (next) {
  // Basic validation, more complex time logic might be needed
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    return next(new Error('End time must be after start time.'));
  }
  // Prevent overlapping bookings (more complex query needed in controller before saving)
  next();
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
