const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { verify } = require("./mailer");
require("dotenv").config();


// create user
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.status(400).json({ message: "Email already exist" });

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = await crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      verificationToken,
    });
    await newUser.save();
    await verify(email, verificationToken);
    return res
      .status(200)
      .json({ message: "User created!, verify your email to login" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

//  Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.isVerified = true;
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, isVerified: user.isVerified  },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in", error });
  }
};

//  Get User Profile (Protected Route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

// Update User Profile (Protected Route)
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email },
      { new: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

//  Delete User Account (Protected Route)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.getPublicStaff = async (req, res) => {
  try {
    const staff = await User.find({ isVerified: true })
      .select("fullName email profile") // Select only public fields
      .populate("profile");

    res.json({ message: "Staff retrieved successfully", data: staff });
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};
