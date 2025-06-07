import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because it will be removed in toJSON
  avatar?: string;
  role: 'student' | 'vendor' | 'admin' | 'university_staff';
  studentId?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  businessName?: string;
  businessType?: 'individual' | 'company' | 'university_department';
  businessLicense?: string;
  location?: string;
  contactNumber?: string;
  bio?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  totalSales: number;
  totalPurchases: number;
  lastActive?: Date;
  verificationLevel: 'none' | 'email' | 'student_id' | 'full';
  trustScore: number;
  badges: string[];
  wishlist: mongoose.Types.ObjectId[]; // Array of Product ObjectIds
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['student', 'vendor', 'admin', 'university_staff'],
      default: 'student',
    },
    studentId: { type: String, optional: true },
    university: { type: String, optional: true },
    major: { type: String, optional: true },
    graduationYear: { type: Number, optional: true },
    businessName: { type: String, optional: true },
    businessType: {
      type: String,
      enum: ['individual', 'company', 'university_department'],
      optional: true,
    },
    businessLicense: { type: String, optional: true },
    location: { type: String, optional: true },
    contactNumber: { type: String, optional: true },
    bio: { type: String, optional: true },
    socialMedia: {
      instagram: { type: String, optional: true },
      twitter: { type: String, optional: true },
      linkedin: { type: String, optional: true },
    },
    totalSales: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    lastActive: { type: Date, optional: true },
    verificationLevel: {
      type: String,
      enum: ['none', 'email', 'student_id', 'full'],
      default: 'none',
    },
    trustScore: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: [],
    }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Do not send password hash to client
        delete ret.__v;
        // ret.id = ret._id; // Standard practice, but mongoose does this by default if _id is not explicitly excluded
        // delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
       transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        // ret.id = ret._id;
        // delete ret._id;
      },
    }
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
