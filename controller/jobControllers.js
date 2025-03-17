const jobModel = require("../model/jobModel.js")

// CREATE JOB FORM
const createJob = async (req, res) => {
    try {
        const {
            hospitalName,
            location,
            contactName,
            email,
            phoneNo,
            jobDetails,
            jobTitle,
            jobType,
            shiftType,
            jobDescription,
            jobRequirements,
            requiredCertifications,
            applicationDeadline
        } = req.body

        const post = await jobModel.create()

    } catch(error) {
        res.status(500).json({ERROR: error.message})
    }
}

// GET A  JOB
const getOneJob = async (req, res) => {
    try {

    } catch(err) {
        res.status(500).json({ERROR: error.message})
    }
}

// GET ALL JOBS
const getAllJobs = async (req, res) => {
    try{ 

    } catch(error) {
        res.status(500).json({ERROR: error.message})
    }
}

// UPDATE A JOB

const updateJob = async (req, res) => {
    try {

    } catch(error) {
        res.status(500).json({ERROR: error.message})
    }
}

// DELETE A JOB

const deleteJob = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ERROR: error.message})
    }
}

module.exports = {createJob, getAllJobs, getOneJob, updateJob, deleteJob}