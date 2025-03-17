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
  "/",
  authMiddleware,
  upload.fields([{ name: "profilePicture" }, { name: "resume" }]),
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
profileRouter.get("/:userId", authMiddleware, getProfile);



// Get all profiles (Public access)
profileRouter.get("/", getAllProfiles);

module.exports = profileRouter;
