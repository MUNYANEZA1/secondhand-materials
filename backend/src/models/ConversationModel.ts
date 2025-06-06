import mongoose, { Document, Schema } from 'mongoose';
import { IMessage } from './MessageModel'; // For lastMessage type

export interface IConversation extends Document {
  participants: mongoose.Schema.Types.ObjectId[]; // Array of User IDs
  product?: mongoose.Schema.Types.ObjectId; // Optional: reference to a Product, Service, etc.
  lastMessage?: IMessage; // Denormalized last message for quick preview
  unreadCounts?: Map<string, number>; // Map<userId, count>
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    product: { type: mongoose.Schema.Types.ObjectId, refPath: 'productModel' }, // Dynamic ref
    productModel: { type: String, enum: ['Product', 'Service', 'Ride'] }, // To specify which model product refers to
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    // Store unread counts per user within a conversation.
    // Example: { "userId1": 2, "userId2": 0 }
    // This can be complex to manage efficiently with just mongoose.
    // A simpler approach might be a separate 'readBy' array in MessageModel.
    // For now, keeping it simple or omitting direct unread count here.
    // unreadCounts: {
    //   type: Map,
    //   of: Number,
    //   default: {}
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Ensure unique conversation between a set of participants (and optionally a product)
// This is a bit tricky for an array of participants.
// A common approach is to sort participant IDs and create a compound key,
// or handle this logic in the controller before creating a new conversation.
conversationSchema.index({ participants: 1 });
conversationSchema.index({ participants: 1, product: 1 });


const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
