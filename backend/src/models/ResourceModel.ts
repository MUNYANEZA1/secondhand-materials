import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  fileUrl: string; // Cloudinary URL
  fileName?: string; // Original file name
  fileType: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'txt' | 'zip' | 'dataset' | 'image' | 'video' | 'audio' | 'other';
  fileSize: string; // e.g., "2.4 MB"
  category: string; // e.g., "Course Notes", "Past Papers", "Templates"
  course?: string; // e.g., "CS101"
  department?: string;
  uploader: { // Denormalized user info
    id: mongoose.Schema.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  tags: string[];
  downloads: number;
  ratings?: Array<{ // Simple rating system
    user: mongoose.Schema.Types.ObjectId;
    rating: number; // 1-5
    comment?: string;
    createdAt: Date;
  }>;
  averageRating?: number;
  ratingCount?: number;
  isApproved: boolean; // For admin/moderator approval
  accessType: 'free' | 'view-only' | 'restricted'; // 'restricted' might need more role/permission checks
  status: 'active' | 'pending_approval' | 'rejected' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'dataset', 'image', 'video', 'audio', 'other'],
      required: true,
    },
    fileSize: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    course: { type: String, trim: true },
    department: { type: String, trim: true },
    uploader: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      avatar: { type: String },
    },
    tags: [{ type: String, trim: true }],
    downloads: { type: Number, default: 0 },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
        _id: false,
      }
    ],
    averageRating: { type: Number, default: 0, min:0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }, // Default to not approved
    accessType: { type: String, enum: ['free', 'view-only', 'restricted'], default: 'free' },
    status: { type: String, enum: ['active', 'pending_approval', 'rejected', 'archived'], default: 'pending_approval'},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

resourceSchema.index({ title: 'text', description: 'text', category: 1, course: 1, department: 1, tags: 1 });
resourceSchema.index({ uploader: 1 });
resourceSchema.index({ status: 1, isApproved: 1 });

// Pre-save hook to calculate average rating
resourceSchema.pre('save', function(next) {
  if (this.isModified('ratings') && this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = parseFloat((totalRating / this.ratings.length).toFixed(1));
    this.ratingCount = this.ratings.length;
  } else if (this.isModified('ratings') && this.ratings && this.ratings.length === 0) {
    this.averageRating = 0;
    this.ratingCount = 0;
  }
  // If approved, set status to active. If not approved and status is active, set to pending.
  if (this.isModified('isApproved')) {
    if (this.isApproved && this.status !== 'archived') {
        this.status = 'active';
    } else if (!this.isApproved && this.status === 'active') {
        this.status = 'pending_approval'; // Or 'rejected' if that's the flow
    }
  }
  next();
});


const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;
