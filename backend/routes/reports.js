const express = require('express');
const router = express.Router();

const { 
  generateItemsInventoryReport,
  generateItemsByCategoryReport
} = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Report routes
router.get('/items-inventory', generateItemsInventoryReport);
router.get('/items-by-category', generateItemsByCategoryReport);

module.exports = router;
