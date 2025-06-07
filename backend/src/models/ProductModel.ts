import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  category: string;
  subcategory?: string;
  images: string[]; // Array of Cloudinary image URLs
  seller: mongoose.Schema.Types.ObjectId | Record<string, unknown>; // Reference to User model
  location: string;
  tags: string[];
  isFree: boolean;
  isActive: boolean;
  views: number;
  likes: number;
  ownerType?: 'student' | 'university'; // As per frontend slice
  staffOnly?: boolean; // As per frontend slice
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    condition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair', 'poor'],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    images: [{ type: String, required: true }], // URLs from Cloudinary
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    location: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    isFree: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // Active by default
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    ownerType: { type: String, enum: ['student', 'university'] },
    staffOnly: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for searching and filtering
productSchema.index({ title: 'text', description: 'text', category: 1, location: 1, price: 1 });
productSchema.index({ likes: -1 });
productSchema.index({ views: -1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
