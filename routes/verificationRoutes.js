const express = require("express");
const {
  submitVerification,
  getVerification,
  updateVerificationStatus,
} = require("../controller/verificationController");
const uploadVerificationMiddleware = require("../middleware/uploadverification");
const authMiddleware = require("../middleware/authentication");
const adminMiddleware = require("../middleware/adminMiddleware");

const verificationRouter = express.Router();

// Submit verification documents
verificationRouter.post("/", authMiddleware, uploadVerificationMiddleware, submitVerification);

// Get verification status
verificationRouter.get("/:userId", authMiddleware, getVerification);

// Update verification status (Admin only)
verificationRouter.put("/:id", authMiddleware, adminMiddleware, updateVerificationStatus);

module.exports = verificationRouter;
