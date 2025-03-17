const Verification = require("../model/verificationModel");

/**
 * @desc Submit Verification Documents
 * @route POST /api/verification
 * @access Private (User)
 */
exports.submitVerification = async (req, res) => {
  try {
    const { fullName, email, profession, licenseNumber } = req.body;

    // Extract uploaded document URLs from Cloudinary
    const mdcnLicense = req.files["mdcnLicense"] ? req.files["mdcnLicense"][0].path : null;
    const nyscCertificate = req.files["nyscCertificate"] ? req.files["nyscCertificate"][0].path : null;
    const housemanshipCertificate = req.files["housemanshipCertificate"] ? req.files["housemanshipCertificate"][0].path : null;
    const pcnLicense = req.files["pcnLicense"] ? req.files["pcnLicense"][0].path : null;
    const nmcnLicense = req.files["nmcnLicense"] ? req.files["nmcnLicense"][0].path : null;
    const mlscnLicense = req.files["mlscnLicense"] ? req.files["mlscnLicense"][0].path : null;
    const rrbnLicense = req.files["rrbnLicense"] ? req.files["rrbnLicense"][0].path : null;
    const odorbnLicense = req.files["odorbnLicense"] ? req.files["odorbnLicense"][0].path : null;
    const chprbnLicense = req.files["chprbnLicense"] ? req.files["chprbnLicense"][0].path : null;

    // Handle additional documents
    const otherDocuments = req.files["otherDocuments"] ? req.files["otherDocuments"].map(file => file.path) : [];

    // Create verification entry
    const verification = await Verification.create({
      fullName,
      email,
      profession,
      licenseNumber,
      documents: {
        mdcnLicense,
        nyscCertificate,
        housemanshipCertificate,
        pcnLicense,
        nmcnLicense,
        mlscnLicense,
        rrbnLicense,
        odorbnLicense,
        chprbnLicense,
        otherDocuments
      },
      status: "Pending"
    });

    res.status(201).json({ message: "Verification submitted successfully!", data: verification });
  } catch (error) {
    res.status(500).json({ message: "Error submitting verification", error });
  }
};

/**
 * @desc Get Verification Status
 * @route GET /api/verification/:userId
 * @access Private (User)
 */
exports.getVerification = async (req, res) => {
  try {
    const verification = await Verification.findOne({ email: req.user.email });

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving verification", error });
  }
};

/**
 * @desc Update Verification Status (Admin Only)
 * @route PUT /api/verification/:id
 * @access Private (Admin)
 */
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedVerification = await Verification.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedVerification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.json({ message: "Verification status updated successfully", data: updatedVerification });
  } catch (error) {
    res.status(500).json({ message: "Error updating verification status", error });
  }
};
