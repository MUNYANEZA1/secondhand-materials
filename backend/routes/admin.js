const express = require('express');
const router = express.Router();

const { 
  getDashboardStats,
  getPendingItems,
  approveItem,
  rejectItem
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.get('/dashboard', getDashboardStats);
router.get('/items/pending', getPendingItems);
router.put('/items/:id/approve', approveItem);
router.put('/items/:id/reject', rejectItem);

module.exports = router;
