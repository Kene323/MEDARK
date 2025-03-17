const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Jobs posted
    hospitalProfile: { type: mongoose.Schema.Types.ObjectId, ref: "HospitalProfile" },
    verification: { type: mongoose.Schema.Types.ObjectId, ref: "HospitalVerification" } // Hospital verification reference
  }, { timestamps: true });
  

  

const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;