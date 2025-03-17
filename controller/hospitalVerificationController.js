const HospitalVerification = require("../model/hospitalverification");
const Hospital = require("../model/hospitalModel");

/**
 * @desc Request verification for a hospital
 * @route POST /api/hospital/verification
 * @access Private (Hospital Only)
 */
exports.requestVerification = async (req, res) => {
  try {
    const { hospitalId } = req.body;

    // Ensure hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Check if verification request already exists
    const existingRequest = await HospitalVerification.findOne({ hospital: hospitalId });
    if (existingRequest) {
      return res.status(400).json({ message: "Verification request already submitted" });
    }

    // Upload documents from request
    const documentUrls = req.files.map((file) => file.path);

    // Create verification request
    const newVerification = await HospitalVerification.create({
      hospital: hospitalId,
      documents: documentUrls,
    });

    res.status(201).json({ message: "Verification request submitted", data: newVerification });
  } catch (error) {
    res.status(500).json({ message: "Error requesting verification", error });
  }
};

/**
 * @desc Get all verification requests (Admin Only)
 * @route GET /api/admin/hospital-verifications
 * @access Private (Admin)
 */
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await HospitalVerification.find().populate("hospital", "name email location");
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching verifications", error });
  }
};

/**
 * @desc Approve or Reject a Verification Request
 * @route PUT /api/admin/hospital-verifications/:id
 * @access Private (Admin)
 */
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const { id } = req.params;

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedVerification = await HospitalVerification.findByIdAndUpdate(
      id,
      { status, comments },
      { new: true }
    ).populate("hospital", "name email location");

    if (!updatedVerification) {
      return res.status(404).json({ message: "Verification request not found" });
    }

    res.json({ message: `Verification ${status.toLowerCase()} successfully`, data: updatedVerification });
  } catch (error) {
    res.status(500).json({ message: "Error updating verification status", error });
  }
};

/**
 * @desc Delete a Verification Request (Admin Only)
 * @route DELETE /api/admin/hospital-verifications/:id
 * @access Private (Admin)
 */
exports.deleteVerification = async (req, res) => {
  try {
    const deletedVerification = await HospitalVerification.findByIdAndDelete(req.params.id);
    if (!deletedVerification) {
      return res.status(404).json({ message: "Verification request not found" });
    }

    res.json({ message: "Verification request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting verification request", error });
  }
};
