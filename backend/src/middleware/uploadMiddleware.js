const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import the config we just made!
const AppError = require('../utils/AppError');

// 1. Tell Multer to send files directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'astu-msj-bootcamp/avatars', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], 
    transformation: [{ width: 500, height: 500, crop: 'fill' }] 
  },
});

// 2. Ensure they only upload images (Security check)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// 3. Build the upload middleware
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

exports.uploadUserAvatar = upload.single('avatar');