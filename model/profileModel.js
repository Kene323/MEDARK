const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  profession: { 
    type: String, 
    required: true, 
    // enum: [
    //   "Doctor", "Pharmacist", "Nurse", "Medical Lab Scientist",
    //   "Radiographer", "Optometrist", "Community Health Officer"
    // ] 
  },
  bio: { type: String },
  experience: { type: Number, default: 0 },
  phone: { type: String },
  location: { type: String },
  profilePicture: { type: String },
  resume: { type: String },
  jobApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;  //  Ensure this is properly exported
