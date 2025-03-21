const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken : String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" }, // User profile reference
  verification: { type: mongoose.Schema.Types.ObjectId, ref: "Verification" }, // Verification reference
  isVerified: { type: Boolean, default: false }, // Quick verification check
  jobApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }], // Job applications reference
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
