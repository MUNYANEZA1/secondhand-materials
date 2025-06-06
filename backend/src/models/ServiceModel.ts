import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  price: number; // For fixed or as a general reference
  hourlyRate?: number;
  category: string;
  serviceType: 'hourly' | 'fixed' | 'negotiable';
  availability: string; // Text description of availability
  location: 'on-campus' | 'off-campus' | 'remote' | 'flexible';
  images: string[]; // Array of Cloudinary image URLs
  provider: {
    id: mongoose.Schema.Types.ObjectId; // Reference to User model
    name: string; // Denormalized from User
    avatar?: string; // Denormalized from User
    rating?: number; // Could be calculated or managed separately
    reviewCount?: number; // Could be calculated or managed separately
    verified?: boolean; // Denormalized from User
  };
  tags: string[];
  isActive: boolean;
  views: number;
  contactCount: number; // Number of times contact info was revealed or provider was messaged
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    hourlyRate: { type: Number },
    category: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      enum: ['hourly', 'fixed', 'negotiable'],
      required: true,
    },
    availability: { type: String, required: true },
    location: {
      type: String,
      enum: ['on-campus', 'off-campus', 'remote', 'flexible'],
      required: true,
    },
    images: [{ type: String }], // URLs from Cloudinary, not required
    provider: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true }, // Denormalized for quicker fetches
      avatar: { type: String },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
    },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    contactCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.index({ title: 'text', description: 'text', category: 1, serviceType: 1, location: 1 });

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
