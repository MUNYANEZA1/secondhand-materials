const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");

// Ensure upload directories exist
const profilesDir = path.join(__dirname, "../uploads/profiles");
const itemsDir = path.join(__dirname, "../uploads/items");

// Create directories if they don't exist
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

if (!fs.existsSync(itemsDir)) {
  fs.mkdirSync(itemsDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
      cb(null, profilesDir);
    } else {
      cb(null, itemsDir);
    }
  },
  filename: (req, file, cb) => {
    // Clean the original filename to avoid issues with special characters
    const fileExt = path.extname(file.originalname);
    const fileName = path
      .basename(file.originalname, fileExt)
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`);
  },
});

// Create multer instance with storage configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 1000000), // 1MB default
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(
        new ErrorResponse(
          "Only image files (jpg, jpeg, png, gif) are allowed!",
          400
        ),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
