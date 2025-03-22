const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // Default folder

    if (file.fieldname === "hospitalLogo") folder = "logos";
    if (file.fieldname === "profilePicture") folder = "profile_pictures";
    if (file.fieldname === "resume") folder = "resumes";

    return {
      folder,
      format: ["png","jpg",
        "jpeg"
      ],
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// Multer Middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

module.exports = upload;
