const express = require('express');
const { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  uploadProfilePhoto 
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), advancedResults(User), getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

router.route('/:id/photo').put(uploadProfilePhoto);

module.exports = router;
