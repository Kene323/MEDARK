const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Hospital = require("../model/hospitalModel");
const cloudinary = require("../config/cloudinary"); // Cloudinary config

require("dotenv").config();

// Hospital Signup
exports.registerHospital = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = new Hospital({ name, email, password: hashedPassword, phone, location });

    await hospital.save();
    res.status(201).json({ message: "Hospital registered successfully", hospital });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Hospital Login
exports.loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });

    if (!hospital) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Hospitals
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate("jobs");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Hospital
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate("jobs");
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Update Hospital (Including Logo Upload)
exports.updateHospital = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    let updatedData = { name, phone, location };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.logo = result.secure_url; // Save Cloudinary image URL
    }

    const hospital = await Hospital.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.json({ message: "Hospital updated successfully", hospital });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Hospital
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.json({ message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
