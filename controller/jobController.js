const Job = require("../model/JobsModel");
const Hospital = require("../model/hospitalModel");
// const cloudinary = require("../config/cloudinary");


/**
 * @desc Create a new job posting
 * @route POST /api/jobs
 * @access Private (Hospital Only)
 */
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, targetProfession, location, jobType } = req.body;

    // Ensure the hospital exists
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    

    // Create job
    const newJob = new Job({
      hospital: hospital._id,
      title,
      description,
      requirements,
      targetProfession,
      location,
      jobType
    });

    // Save job to database
    await newJob.save();

    // Push job to the hospital's jobs array
    hospital.jobs.push(newJob._id);
    await hospital.save();

    res.status(201).json({
      message: "Job created successfully",
      data: newJob
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

/**
 * @desc Upload Hospital Logo
 * @route POST /api/hospitals/upload-logo
 * @access Private (Hospital Admin)
 */
exports.uploadHospitalLogo = async (req, res) => {
    try {
      const { hospitalId } = req.body;
  
      // Check if hospital exists
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Upload to Cloudinary
      const imageUrl = req.file.path; // Cloudinary URL
      hospital.logo = imageUrl;
      await hospital.save();
  
      res.json({ message: "Hospital logo uploaded successfully", imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Error uploading hospital logo", error });
    }
  };
    

exports.getAllJobs = async (req, res) => {
  try {
    const {search} = req.query;
    let query = {};
    if (search) {
      query = {
        $or:[
          {hospital:{$regex:search, $option: "i"}},
          {title:{$regex:search,$option: "i"}},
          {description:{$regex: search, $option: "i"}}
        ]
      }
    }
    const jobs = await Job.find(query).populate("hospital", "name logo location");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

exports.getJobsForYou = async (req, res) => {
  try {
    const {profession} = req.params;
    const jobs =  await Job.find({targetProfession: profession}).populate("hospital")
    res.status(200).json(jobs)
  } catch (error) {
    console.log(error)
    res.status(500).json({Message: "Error Fetching Jobs", error})
  }
}

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("hospital", "name logo location");
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, description, requirements, location } = req.body;
    const job = await Job.findById(req.params.jobId);
    
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.title = title || job.title;
    job.description = description || job.description;
    job.requirements = requirements ? requirements.split(",") : job.requirements;
    job.location = location || job.location;

    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};
