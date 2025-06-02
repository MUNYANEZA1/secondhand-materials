const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Item = require('../models/Item');
const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const userCount = await User.countDocuments();
  const itemCount = await Item.countDocuments();
  const pendingItemCount = await Item.countDocuments({ approved: false });
  const pendingReportCount = await Report.countDocuments({ status: 'pending' });
  
  // Get recent items
  const recentItems = await Item.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'userId',
      select: 'firstName lastName'
    });
  
  // Get recent reports
  const recentReports = await Report.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'reporterId',
      select: 'firstName lastName'
    });

  res.status(200).json({
    success: true,
    data: {
      counts: {
        users: userCount,
        items: itemCount,
        pendingItems: pendingItemCount,
        pendingReports: pendingReportCount
      },
      recentItems,
      recentReports
    }
  });
});

// @desc    Get pending items
// @route   GET /api/admin/items/pending
// @access  Private/Admin
exports.getPendingItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ approved: false })
    .sort({ createdAt: 1 })
    .populate({
      path: 'userId',
      select: 'firstName lastName email'
    });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Approve item
// @route   PUT /api/admin/items/:id/approve
// @access  Private/Admin
exports.approveItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  item = await Item.findByIdAndUpdate(
    req.params.id, 
    { 
      approved: true,
      updatedAt: Date.now()
    }, 
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Reject item
// @route   PUT /api/admin/items/:id/reject
// @access  Private/Admin
exports.rejectItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
