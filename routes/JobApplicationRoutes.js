const express = require("express");
const {
  applyForJob,
  getApplicationsByUser,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controller/jobApplicationController");
const authMiddleware = require("../middleware/authentication");

const jobApplicationrouter = express.Router();

jobApplicationrouter.post("/apply", authMiddleware, applyForJob);
jobApplicationrouter.get("/my-applications", authMiddleware, getApplicationsByUser);
jobApplicationrouter.get("/job/:jobId", authMiddleware, getApplicationsForJob);
jobApplicationrouter.put("/:applicationId/status", authMiddleware, updateApplicationStatus);

module.exports = jobApplicationrouter;
