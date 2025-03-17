const express = require("express");
const {
  createOrUpdateHospitalProfile,
  getHospitalProfileById,
  updateHospitalProfile,
  getAllHospitalProfiles,
  uploadHospitalLogo,
  deleteHospitalProfile
} = require("../controller/hospitalProfileController");

const authMiddleware = require("../middleware/authentication");
const upload = require("../middleware/upload");

const hospitalProfileRouter = express.Router();

/**
 * Hospital Profile Routes
 */

//Create or Update Hospital Profile (Includes logo upload if provided)
hospitalProfileRouter.post(
  "/",
  authMiddleware,
  upload.single("logo"),
  createOrUpdateHospitalProfile
);

// Upload Hospital Logo Separately
hospitalProfileRouter.post(
  "/upload-logo",
  authMiddleware,
  upload.single("logo"),
  uploadHospitalLogo
);

// Get Hospital Profile by ID
hospitalProfileRouter.get("/:hospitalId", authMiddleware, getHospitalProfileById);

// Update Hospital Profile (Without re-uploading logo)
hospitalProfileRouter.put("/", authMiddleware, updateHospitalProfile);

// Get All Hospital Profiles (Public access)
hospitalProfileRouter.get("/", getAllHospitalProfiles);

//  Delete Hospital Profile
hospitalProfileRouter.delete("/", authMiddleware, deleteHospitalProfile);

module.exports = hospitalProfileRouter;
