const mongoose = require("mongoose");

const HospitalVerificationSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true }, // Reference to the hospital
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" }, // Verification status
  documents: [{ type: String, required: true }], // Uploaded documents for verification
  comments: { type: String }, 
}, { timestamps: true });

const HospitalVerification = mongoose.model("HospitalVerification", HospitalVerificationSchema);
module.exports = HospitalVerification;
