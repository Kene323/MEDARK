const express = require("express");
const {
  createOrUpdateProfile,
  getProfile,
  getAllProfiles,
  uploadProfilePicture,
  uploadResume
} = require("../controller/profileController");

const authMiddleware = require("../middleware/authentication");
const upload = require("../middleware/upload");

const profileRouter = express.Router();

/**
 * Profile Routes
 */

// Create or Update Profile (Uploads profile picture & resume if provided)
profileRouter.post(
  "/createUpdateProfile",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  createOrUpdateProfile
);

// Upload Profile Picture separately
profileRouter.post(
  "/upload-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// Upload Resume separately
profileRouter.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// Get profile by user ID
profileRouter.get("/getProfile", authMiddleware, getProfile);



// Get all profiles (Public access)
profileRouter.get("/allProfile", getAllProfiles);

module.exports = profileRouter;
