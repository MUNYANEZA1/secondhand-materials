import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
// We'll store files temporarily in memory or on disk before uploading to Cloudinary

// Option 1: Memory storage (good for small files, directly pass buffer to Cloudinary)
const storage = multer.memoryStorage();

// Option 2: Disk storage (if you need to process files or for larger files)
// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

const upload = multer({
  storage: storage, // or diskStorage
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  },
});

export default upload;
