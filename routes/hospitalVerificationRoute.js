const express = require("express");
const { requestVerification, getAllVerifications, updateVerificationStatus, deleteVerification } = require("../controller/hospitalVerificationController");
const upload = require("../middleware/hospitalUploads");
const adminMiddleware = require("../middleware/adminMiddleware");

const hospitalVerificatioRouter = express.Router();

// Hospital Requests Verification (Uploads Files)
hospitalVerificatioRouter.post("/", upload.array("documents", 5), requestVerification);

// Admin Gets All Verification Requests
hospitalVerificatioRouter.get("/", adminMiddleware, getAllVerifications);

// Admin Updates Verification Status
hospitalVerificatioRouter.put("/:id", adminMiddleware, updateVerificationStatus);

// Admin Deletes a Verification Request
hospitalVerificatioRouter.delete("/:id", adminMiddleware, deleteVerification);

module.exports = hospitalVerificatioRouter;
