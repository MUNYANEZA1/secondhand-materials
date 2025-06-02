const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Get user conversations
// @route   GET /api/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user.id] }
  }).populate({
    path: 'participants',
    select: 'firstName lastName profilePhoto'
  }).populate({
    path: 'itemId',
    select: 'title photos'
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations
  });
});

// @desc    Get conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate({
      path: 'participants',
      select: 'firstName lastName profilePhoto'
    })
    .populate({
      path: 'itemId',
      select: 'title photos'
    });

  if (!conversation) {
    return next(new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is part of the conversation
  if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this conversation`, 401));
  }

  res.status(200).json({
    success: true,
    data: conversation
  });
});

// @desc    Create new conversation
// @route   POST /api/conversations
// @access  Private
exports.createConversation = asyncHandler(async (req, res, next) => {
  const { receiverId, itemId, initialMessage } = req.body;

  if (!receiverId || !initialMessage) {
    return next(new ErrorResponse('Please provide a receiver and initial message', 400));
  }

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new ErrorResponse(`User not found with id of ${receiverId}`, 404));
  }

  // Check if conversation already exists between these users about this item
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, receiverId] },
    itemId: itemId || { $exists: false }
  });

  if (!conversation) {
    // Create new conversation
    conversation = await Conversation.create({
      participants: [req.user.id, receiverId],
      itemId: itemId || undefined,
      lastMessage: {
        content: initialMessage,
        senderId: req.user.id,
        createdAt: Date.now()
      }
    });
  }

  // Create message
  const message = await Message.create({
    conversationId: conversation._id,
    senderId: req.user.id,
    content: initialMessage
  });

  // Update conversation with last message
  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: {
      content: initialMessage,
      senderId: req.user.id,
      createdAt: Date.now()
    },
    updatedAt: Date.now()
  });

  res.status(201).json({
    success: true,
    data: {
      conversation,
      message
    }
  });
});

// @desc    Get messages by conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
exports.getMessagesByConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    return next(new ErrorResponse(`Conversation not found with id of ${req.params.conversationId}`, 404));
  }

  // Make sure user is part of the conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access messages in this conversation`, 401));
  }

  const messages = await Message.find({ conversationId: req.params.conversationId })
    .sort({ createdAt: 1 });

  // Mark messages as read if user is not the sender
  await Message.updateMany(
    { 
      conversationId: req.params.conversationId,
      senderId: { $ne: req.user.id },
      read: false
    },
    { read: true }
  );

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, content } = req.body;

  if (!conversationId || !content) {
    return next(new ErrorResponse('Please provide conversation ID and message content', 400));
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new ErrorResponse(`Conversation not found with id of ${conversationId}`, 404));
  }

  // Make sure user is part of the conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to send messages in this conversation`, 401));
  }

  // Create message
  const message = await Message.create({
    conversationId,
    senderId: req.user.id,
    content
  });

  // Update conversation with last message
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: {
      content,
      senderId: req.user.id,
      createdAt: Date.now()
    },
    updatedAt: Date.now()
  });

  res.status(201).json({
    success: true,
    data: message
  });
});
