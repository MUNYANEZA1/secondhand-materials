const express = require("express");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  uploadItemPhotos,
  getItemsByUser,
  getItemsByCategory,
  searchItems,
} = require("../controllers/itemController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Item = require("../models/Item");
const upload = require("../middleware/upload"); // Add this line

router
  .route("/")
  .get(
    advancedResults(Item, {
      path: "userId",
      select: "firstName lastName profilePhoto",
    }),
    getItems
  )
  .post(protect, createItem);

router
  .route("/:id")
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.route("/:id/status").put(protect, updateItemStatus);
// Update this line to include the upload middleware
router
  .route("/:id/photos")
  .put(protect, upload.array("photos", 5), uploadItemPhotos);
router.route("/user/:userId").get(getItemsByUser);
router.route("/category/:category").get(getItemsByCategory);
router.route("/search").get(searchItems);

module.exports = router;
