const express = require("express");
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  uploadHospitalLogo,
  getJobsForYou
} = require("../controller/jobController");
const authMiddleware = require("../middleware/authentication");
const upload = require("../middleware/upload");


const jobRouter = express.Router();

jobRouter.post("/", authMiddleware, createJob);
jobRouter.post("/upload-logo", authMiddleware, upload.single("hospitalLogo"), uploadHospitalLogo);
jobRouter.get("/", getAllJobs);
jobRouter.get("/oneJob/:jobId", authMiddleware, getJobById);
jobRouter.put("/:jobId", authMiddleware, updateJob);
jobRouter.delete("/:jobId", authMiddleware, deleteJob);

module.exports = jobRouter;
