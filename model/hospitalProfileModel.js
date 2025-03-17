const mongoose = require("mongoose");

const hospitalProfileSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  description: { type: String },
  specializations: [{ type: String }], // Array of specializations
  establishedYear: { type: Number }, // Year hospital was established
  services: [{ type: String }], // List of services offered
  accreditation: [{ type: String }], // Accreditation or certifications
  website: { type: String }, // Hospital website URL
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  logo: { type: String }, // Cloudinary URL for hospital logo
  isVerified: { type: Boolean, default: false }, // Admin verification
});

const HospitalProfile = mongoose.model("HospitalProfile", hospitalProfileSchema);
module.exports = HospitalProfile;
