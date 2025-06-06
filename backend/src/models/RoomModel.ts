import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  description: string;
  building: string;
  floor: number;
  roomNumber: string; // Specific room number like 'A-201'
  capacity: number;
  type: 'study_room' | 'meeting_room' | 'lab' | 'classroom' | 'auditorium' | 'other';
  amenities: string[];
  equipment: string[];
  images: string[]; // Array of Cloudinary image URLs
  hourlyRate?: number;
  isBookable: boolean; // Whether this room can be booked by users directly
  status: 'available' | 'maintenance' | 'unavailable'; // General status
  notes?: string; // Admin notes
  managedBy?: mongoose.Schema.Types.ObjectId; // User ID of a room manager
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    building: { type: String, required: true, trim: true },
    floor: { type: Number, required: true },
    roomNumber: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ['study_room', 'meeting_room', 'lab', 'classroom', 'auditorium', 'other'],
      required: true,
    },
    amenities: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    images: [{ type: String }], // URLs from Cloudinary
    hourlyRate: { type: Number, min: 0 },
    isBookable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'unavailable'],
      default: 'available',
    },
    notes: { type: String, trim: true },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roomSchema.index({ name: 1, building: 1, type: 1, capacity: 1 });
roomSchema.index({ 'location.building': 1, 'location.floor': 1 }); // If using nested location

// Ensure unique room identifier (e.g., building + roomNumber) if necessary
// roomSchema.index({ building: 1, roomNumber: 1 }, { unique: true });


const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;
