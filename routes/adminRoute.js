const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware"); // Checks if admin exists in DB
const  {adminAuth}  = require("../middleware/adminAuth"); // Checks JWT token and admin role

const {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  getAllHospitals,
  deleteUser,
  getAllVerifications,
  updateUserVerificationStatus,
  updateHospitalVerificationStatus,
} = require("../controller/adminController");

const adminRouter = express.Router();

// Public Routes (No Authentication Required)
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

//  Admin-Protected Routes
adminRouter.get("/users", adminAuth, adminMiddleware, getAllUsers);
adminRouter.get("/hospitals", adminAuth, adminMiddleware, getAllHospitals);
adminRouter.delete("/users/:id", adminAuth, adminMiddleware, deleteUser);

//  Verification Routes
adminRouter.get("/verification", adminAuth, adminMiddleware, getAllVerifications);
adminRouter.put("/verification/user/:id", adminAuth, adminMiddleware, updateUserVerificationStatus);
adminRouter.put("/verification/hospital/:id", adminAuth, adminMiddleware, updateHospitalVerificationStatus);

module.exports = adminRouter;
