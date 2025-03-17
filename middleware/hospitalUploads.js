const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hospital_verifications",
    allowed_formats: ["jpg", "png", "pdf"],
  },
});

// Multer Upload Middleware
const upload = multer({ storage });

module.exports = upload;
