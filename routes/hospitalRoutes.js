const express = require("express");
const {
  registerHospital,
  loginHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} = require("../controller/hospitalController");
const authMiddleware = require("../middleware/authentication");
const upload = require("../middleware/upload");



const hospitalRouter = express.Router();

hospitalRouter.post("/register", registerHospital);
hospitalRouter.post("/login", loginHospital);
hospitalRouter.get("/", getHospitals);
hospitalRouter.get("/:id", getHospitalById);
hospitalRouter.put("/:id", authMiddleware, upload.single("hospitalLogo"), updateHospital);
hospitalRouter.delete("/:id", authMiddleware, deleteHospital);

module.exports = hospitalRouter;
