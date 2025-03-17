const JobApplication = require("../model/jobApplication");
const Job = require("../model/JobsModel");

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id; // Extracted from JWT authentication

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if the user has already applied
    const existingApplication = await JobApplication.findOne({ jobId, user: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create a new job application
    const application = new JobApplication({
      jobId,
      user: userId,
      status: "Pending",
    });

    await application.save();

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Error applying for job", error });
  }
};

exports.getApplicationsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await JobApplication.find({ user: userId }).populate("jobId");
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ jobId }).populate("user");
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job applications", error });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Error updating application status", error });
  }
};
