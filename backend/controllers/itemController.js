const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Item = require('../models/Item');
const path = require('path');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate({
    path: 'userId',
    select: 'firstName lastName email profilePhoto'
  });

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;
  
  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner or admin
  if (item.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this item`, 401));
  }

  // Update timestamp
  req.body.updatedAt = Date.now();

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner or admin
  if (item.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this item`, 401));
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update item status
// @route   PUT /api/items/:id/status
// @access  Private
exports.updateItemStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status || !['available', 'sold'].includes(status)) {
    return next(new ErrorResponse('Please provide a valid status', 400));
  }

  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner or admin
  if (item.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this item status`, 401));
  }

  item = await Item.findByIdAndUpdate(
    req.params.id, 
    { status, updatedAt: Date.now() }, 
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Upload item photos
// @route   PUT /api/items/:id/photos
// @access  Private
// Upload photos for an item
exports.uploadItemPhotos = asyncHandler(async (req, res, next) => {
  // Check if files exist
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one photo', 400));
  }

  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner
  if (item.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this item`, 401));
  }

  // Create array of photo filenames
  const photos = req.files.map(file => file.filename);

  // Update item with photo filenames
  item.photos = photos;
  await item.save();

  res.status(200).json({
    success: true,
    data: item
  });
});


// @desc    Get items by user
// @route   GET /api/items/user/:userId
// @access  Public
exports.getItemsByUser = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ 
    userId: req.params.userId,
    approved: true
  });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Get items by category
// @route   GET /api/items/category/:category
// @access  Public
exports.getItemsByCategory = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ 
    category: req.params.category,
    approved: true,
    status: 'available'
  });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Search items
// @route   GET /api/items/search
// @access  Public
exports.searchItems = asyncHandler(async (req, res, next) => {
  const { query, category, minPrice, maxPrice, condition } = req.query;
  
  const searchQuery = {
    approved: true,
    status: 'available'
  };
  
  // Text search if query provided
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Filter by category if provided
  if (category) {
    searchQuery.category = category;
  }
  
  // Filter by price range if provided
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = Number(minPrice);
    if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
  }
  
  // Filter by condition if provided
  if (condition) {
    searchQuery.condition = condition;
  }
  
  const items = await Item.find(searchQuery).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});
