const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
}, { timestamps: true });

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
module.exports = JobApplication;
