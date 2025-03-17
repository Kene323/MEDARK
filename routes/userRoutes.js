const express = require("express");
const { login, register, getUserProfile, updateUserProfile, deleteUser, getPublicStaff } = require("../controller/userController");

const authenticate = require("../middleware/authentication");
const userRouters = express.Router();

userRouters.post("/register", register);
userRouters.post("/login", login);
userRouters.get("/profile", authenticate, getUserProfile);
userRouters.put("/profile", authenticate, updateUserProfile);
userRouters.delete("/delete", authenticate, deleteUser);
userRouters.get("/public-staff", getPublicStaff); // Publicly accessible route

module.exports = userRouters;
