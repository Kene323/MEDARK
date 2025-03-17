const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");
require("dotenv").config();

const adminMiddleware = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify and decode token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request

    // Check if user exists and is an admin
    const user = await Admin.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only!" });
    }

    next(); // Proceed if admin
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = adminMiddleware;
