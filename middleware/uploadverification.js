const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "verification_documents", // Store documents in Cloudinary folder
    resource_type: "auto", // Detect file type
    allowed_formats: ["pdf", "jpg", "jpeg", "png"], // Accept PDF & images
  },
});

// Initialize Multer upload middleware with multiple fields
const uploadVerification = multer({
  storage: storage,
}).fields([
  { name: "mdcnLicense", maxCount: 1 },
  { name: "nyscCertificate", maxCount: 1 },
  { name: "housemanshipCertificate", maxCount: 1 },
  { name: "pcnLicense", maxCount: 1 },
  { name: "nmcnLicense", maxCount: 1 },
  { name: "mlscnLicense", maxCount: 1 },
  { name: "rrbnLicense", maxCount: 1 },
  { name: "odorbnLicense", maxCount: 1 },
  { name: "chprbnLicense", maxCount: 1 },
  { name: "otherDocuments", maxCount: 5 }, // Allows multiple additional documents
]);

module.exports = uploadVerification;
