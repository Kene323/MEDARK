import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // ✅ Links to User
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { 
    type: String, 
    required: true, 
    enum: [
      "Doctor", "Pharmacist", "Nurse", "Medical Lab Scientist",
      "Radiographer", "Optometrist", "Community Health Officer"
    ] 
  },
  licenseNumber: { type: String, required: true, unique: true },
  documents: {
    mdcnLicense: { type: String },
    nyscCertificate: { type: String }, 
    housemanshipCertificate: { type: String },
    pcnLicense: { type: String }, 
    nmcnLicense: { type: String }, 
    mlscnLicense: { type: String },
    rrbnLicense: { type: String }, 
    odorbnLicense: { type: String }, 
    chprbnLicense: { type: String },
    otherDocuments: [{ type: String }] 
  },
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
  comments: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
