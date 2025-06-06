import express from 'express';
import {
  getConversations,
  findOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware'; // If handling file uploads for chat messages via server

const router = express.Router();

// Conversation routes
router.route('/conversations')
  .get(protect, getConversations);

router.route('/conversations/findOrCreate')
  .post(protect, findOrCreateConversation);

router.route('/conversations/:conversationId/messages')
  .get(protect, getMessages);

router.route('/conversations/:conversationId/read')
    .post(protect, markMessagesAsRead);

// Message routes
router.route('/messages')
  // .post(protect, upload.single('chatFile'), sendMessage); // If server handles chat file uploads
  .post(protect, sendMessage); // Assuming client uploads to Cloudinary and sends URL


export default router;
