const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
