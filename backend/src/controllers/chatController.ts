import { Request, Response } from 'express';
import Conversation, { IConversation } from '../models/ConversationModel';
import Message, { IMessage } from '../models/MessageModel';
import User, { IUser } from '../models/UserModel';
import { uploadToCloudinary } from '../config/cloudinary'; // If sending files/images
import mongoose from 'mongoose';


// @desc    Get all conversations for the logged-in user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const conversations = await Conversation.find({ participants: user._id })
      .populate('participants', 'name avatar email role')
      .populate('lastMessage')
      .populate('product', 'title images price') // Populate some basic product info
      .sort({ updatedAt: -1 }); // Sort by most recently active

    // Optionally, calculate unread counts for each conversation for the current user
    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            sender: { $ne: user._id }, // Messages not sent by the current user
            readBy: { $nin: [user._id] } // And not read by the current user
        });
        return { ...conv.toObject(), unreadCount }; // Use toObject() to allow adding properties
    }));


    res.json(conversationsWithUnread);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get or create a conversation between two users (optionally about a product)
// @route   POST /api/chat/conversations/findOrCreate
// @access  Private
export const findOrCreateConversation = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { recipientId, productId, productModel } = req.body;

    if (!recipientId) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }
    if (recipientId === user._id.toString()) {
        return res.status(400).json({ message: "Cannot create a conversation with yourself." });
    }

    const participants = [user._id, new mongoose.Types.ObjectId(recipientId)].sort(); // Sort to ensure consistent query

    const query: any = { participants: { $all: participants, $size: 2 } };
    if (productId && productModel) {
        query.product = new mongoose.Types.ObjectId(productId);
        query.productModel = productModel;
    } else {
        // If no product, ensure we find a general conversation (not product-specific)
        query.product = { $exists: false };
    }

    try {
        let conversation = await Conversation.findOne(query)
            .populate('participants', 'name avatar email')
            .populate('lastMessage')
            .populate('product', 'title images');

        if (!conversation) {
            const newConversationData: Partial<IConversation> = { participants };
            if (productId && productModel) {
                newConversationData.product = new mongoose.Types.ObjectId(productId);
                newConversationData.productModel = productModel;
            }
            conversation = new Conversation(newConversationData);
            await conversation.save();
            // Re-populate after save to get consistent output
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'name avatar email')
                .populate('product', 'title images') as IConversation;
        }
        res.status(conversation.isNew ? 201 : 200).json(conversation);
    } catch (error: any) {
        console.error('Error finding or creating conversation:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get messages for a specific conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
export const getMessages = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { conversationId } = req.params;
  const { limit = 20, before } = req.query; // before is for pagination (messageId or timestamp)

  try {
    const conversation = await Conversation.findOne({ _id: conversationId, participants: user._id });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found or you are not a participant.' });
    }

    const query: any = { conversation: conversationId };
    if (before) {
      // Assuming 'before' is a message ID, fetch messages older than that one
      // This requires fetching the 'before' message to get its createdAt for robust pagination
      const beforeMessage = await Message.findById(before as string);
      if(beforeMessage) query.createdAt = { $lt: beforeMessage.createdAt };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 }) // Get newest first, or oldest first depending on UI
      .limit(Number(limit));

    // Mark messages as read by the current user
    // This can be done more efficiently in bulk or via a separate endpoint
    const messageIdsToMarkRead = messages
        .filter(msg => msg.sender._id.toString() !== user._id.toString() && !msg.readBy.includes(user._id))
        .map(msg => msg._id);

    if (messageIdsToMarkRead.length > 0) {
        await Message.updateMany(
            { _id: { $in: messageIdsToMarkRead } },
            { $addToSet: { readBy: user._id } }
        );
    }

    res.json(messages.reverse()); // Reverse to show oldest first for typical chat UI
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Send a new message
// @route   POST /api/chat/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { conversationId, content, recipientId, type = 'text', fileUrl, fileName, fileSize } = req.body;

  if (!conversationId && !recipientId) {
    return res.status(400).json({ message: 'Conversation ID or Recipient ID is required.' });
  }
  if (!content && type === 'text') {
    return res.status(400).json({ message: 'Message content is required for text messages.' });
  }
  if ((type === 'image' || type === 'file') && !fileUrl) {
    return res.status(400).json({ message: 'File URL is required for image/file messages.' });
  }

  let convId = conversationId;

  try {
    // If conversationId is not provided, try to find or create one with recipientId
    // This part might be better handled by a dedicated "start conversation" endpoint
    if (!convId && recipientId) {
        const participants = [user._id, new mongoose.Types.ObjectId(recipientId)].sort();
        let conv = await Conversation.findOne({ participants: { $all: participants, $size: 2 }, product: { $exists: false } }); // General conv
        if (!conv) {
            conv = new Conversation({ participants });
            await conv.save();
        }
        convId = conv._id;
    }

    const conversation = await Conversation.findOne({ _id: convId, participants: user._id });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found or you are not a participant.' });
    }

    const messageData: Partial<IMessage> = {
      conversation: convId,
      sender: user._id,
      content,
      type,
      readBy: [user._id], // Sender has read it by default
      status: 'sent',
    };

    if (type === 'image' || type === 'file') {
      messageData.fileUrl = fileUrl;
      messageData.fileName = fileName;
      messageData.fileSize = fileSize;
    }

    // Handle file upload if a file is sent with the message
    // This example assumes fileUrl is directly provided after upload by client to Cloudinary
    // If server needs to handle upload:
    // const file = req.file as Express.Multer.File;
    // if (file && (type === 'image' || type === 'file')) {
    //     const b64 = Buffer.from(file.buffer).toString('base64');
    //     const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    //     messageData.fileUrl = await uploadToCloudinary(dataURI, 'chat_files');
    //     messageData.fileName = file.originalname;
    //     messageData.fileSize = `${(file.size / (1024*1024)).toFixed(2)} MB`;
    // }


    const message = new Message(messageData);
    await message.save();

    // Update conversation's lastMessage and updatedAt timestamp
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date(); // Explicitly set to trigger timestamp update
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    // TODO: Real-time: Broadcast message via WebSockets to other participants in conversation
    // global.io.to(conversationId).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server Error sending message', error: error.message });
  }
};

// @desc    Mark messages in a conversation as read
// @route   POST /api/chat/conversations/:conversationId/read
// @access  Private
export const markMessagesAsRead = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { conversationId } = req.params;

    try {
        const conversation = await Conversation.findOne({ _id: conversationId, participants: user._id });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or user not a participant.' });
        }

        const result = await Message.updateMany(
            {
                conversation: conversationId,
                sender: { $ne: user._id }, // Messages not sent by the current user
                readBy: { $nin: [user._id] }  // And not yet read by the current user
            },
            { $addToSet: { readBy: user._id }, $set: { status: 'read'} } // Also update status if needed
        );

        // TODO: Real-time: Notify sender that messages were read (e.g. update UI for them)

        res.json({ message: 'Messages marked as read.', modifiedCount: result.modifiedCount });
    } catch (error: any) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
