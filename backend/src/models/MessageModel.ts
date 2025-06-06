import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversation: mongoose.Schema.Types.ObjectId; // Reference to Conversation model
  sender: mongoose.Schema.Types.ObjectId; // User ID of the sender
  recipient?: mongoose.Schema.Types.ObjectId; // User ID of the recipient (might be derived from conversation)
  content: string;
  type: 'text' | 'image' | 'file' | 'system'; // System for e.g. "User X joined"
  fileUrl?: string; // For image/file types
  fileName?: string;
  fileSize?: string;
  readBy: mongoose.Schema.Types.ObjectId[]; // Array of User IDs who have read the message
  status: 'sent' | 'delivered' | 'read' | 'failed'; // Message status
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Not strictly needed if using conversation participants
    content: { type: String, required: true, trim: true },
    type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
    fileUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: String },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
