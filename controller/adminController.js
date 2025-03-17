const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");
const User = require("../model/userModel");
const Hospital = require("../model/hospitalModel");
// const Profile = require("../model/profileModel");
const Verification = require("../model/verificationModel");
const HospitalVerification = require("../model/hospitalverification");
const Job = require("../model/jobModel");
require("dotenv").config();

/**
 * @desc Register a new Admin
 * @route POST /api/admin/register
 * @access Private (Super Admin)
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create admin (password hashing is handled in schema)
    const newAdmin = await Admin.create({ fullName, email, password });

    res.status(201).json({ message: "Admin registered successfully", data: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
};

/**
 * @desc Admin Login
 * @route POST /api/admin/login
 * @access Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Admin login successful", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

/**
 * @desc Get All Users with Profiles and Credentials
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("profile")
      .populate("verification");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

/**
 * @desc Get All Hospitals with Profiles and Credentials
 * @route GET /api/admin/hospitals
 * @access Private (Admin)
 */
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate("profile")
      .populate("HospitalVerification");

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospitals", error });
  }
};

/**
 * @desc Delete User (Admin Only)
 * @route DELETE /api/admin/users/:id
 * @access Private (Admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

/**
 * @desc Get All Verification Requests (For Users & Hospitals)
 * @route GET /api/admin/verification
 * @access Private (Admin)
 */
exports.getAllVerifications = async (req, res) => {
  try {
    const userVerifications = await Verification.find().populate("user", "fullName email");
    const hospitalVerifications = await HospitalVerification.find().populate("hospital", "name email");

    res.json({ userVerifications, hospitalVerifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching verification requests", error });
  }
};

/**
 * @desc Update User Verification Status
 * @route PUT /api/admin/verification/user/:id
 * @access Private (Admin)
 */
exports.updateUserVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the verification record
    const updatedVerification = await Verification.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user");

    if (!updatedVerification) {
      return res.status(404).json({ message: "Verification request not found" });
    }

    // Update the user’s isVerified field
    const user = await User.findById(updatedVerification.user._id);
    if (user) {
      user.isVerified = status === "Verified"; // Set to true if verified, false if rejected
      await user.save();
    }

    res.json({ message: `User verification ${status.toLowerCase()} successfully`, data: updatedVerification });
  } catch (error) {
    res.status(500).json({ message: "Error updating user verification status", error });
  }
};

/**
 * @desc Update Hospital Verification Status
 * @route PUT /api/admin/verification/hospital/:id
 * @access Private (Admin)
 */
exports.updateHospitalVerificationStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the hospital verification record
    const updatedVerification = await HospitalVerification.findByIdAndUpdate(
      req.params.id,
      { status, comments },
      { new: true }
    ).populate("hospital");

    if (!updatedVerification) {
      return res.status(404).json({ message: "Hospital verification request not found" });
    }

    // Update the hospital's isVerified field
    const hospital = await Hospital.findById(updatedVerification.hospital.__id);
    if (hospital) {
      hospital.isVerified = status === "Verified"; // Set to true if verified, false if rejected
      await hospital.save();
    }

    res.json({ message: `Hospital verification ${status.toLowerCase()} successfully`, data: updatedVerification });
  } catch (error) {
    res.status(500).json({ message: "Error updating hospital verification status", error });
  }
};
