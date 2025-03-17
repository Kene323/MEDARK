const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    targetProfession: {
      type: String,
      required: true, // Specifies who the job is for (e.g., Nurse, Doctor)
    },
    location: {
      type: String,
      required: true,
    },
    logo: {
      type: String, // Cloudinary or any image URL
      default: null,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
