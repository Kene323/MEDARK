const HospitalProfile = require("../model/hospitalProfileModel");

/**
 * @desc Create or Update Hospital Profile
 * @route POST /api/hospital/profile
 * @access Private (Hospital)
 */
exports.createOrUpdateHospitalProfile = async (req, res) => {
  try {
    const { description, specializations, establishedYear, services, accreditation, website, socialLinks } = req.body;

    let hospitalProfile = await HospitalProfile.findOne({ hospital: req.user.id });

    // Handle logo upload
    const logo = req.file ? req.file.path : hospitalProfile?.logo;

    if (hospitalProfile) {
      // Update existing profile
      hospitalProfile = await HospitalProfile.findOneAndUpdate(
        { hospital: req.user.id },
        { description, specializations, establishedYear, services, accreditation, website, socialLinks, logo },
        { new: true }
      );
      return res.json({ message: "Profile updated successfully", data: hospitalProfile });
    }

    // Create new profile
    const newProfile = await HospitalProfile.create({
      hospital: req.user.id,
      description,
      specializations,
      establishedYear,
      services,
      accreditation,
      website,
      socialLinks,
      logo,
    });

    res.status(201).json({ message: "Profile created successfully", data: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Error creating/updating profile", error });
  }
};

/**
 * @desc Upload Hospital Logo Separately
 * @route POST /api/hospital/profile/upload-logo
 * @access Private (Hospital)
 */
exports.uploadHospitalLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let hospitalProfile = await HospitalProfile.findOne({ hospital: req.user.id });

    if (!hospitalProfile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    hospitalProfile.logo = req.file.path;
    await hospitalProfile.save();

    res.json({ message: "Logo uploaded successfully", logo: hospitalProfile.logo });
  } catch (error) {
    res.status(500).json({ message: "Error uploading logo", error });
  }
};

/**
 * @desc Get Hospital Profile by Hospital ID
 * @route GET /api/hospital/profile/:hospitalId
 * @access Public
 */
exports.getHospitalProfileById = async (req, res) => {
  try {
    const profile = await HospitalProfile.findOne({ hospital: req.params.hospitalId }).populate("hospital", "name email");
    if (!profile) return res.status(404).json({ message: "Hospital profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

/**
 * @desc Get All Hospital Profiles
 * @route GET /api/hospital/profiles
 * @access Public
 */
exports.getAllHospitalProfiles = async (req, res) => {
  try {
    const profiles = await HospitalProfile.find().populate("hospital", "name email");
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital profiles", error });
  }
};

/**
 * @desc Update Hospital Profile (excluding logo)
 * @route PUT /api/hospital/profile
 * @access Private (Hospital)
 */
exports.updateHospitalProfile = async (req, res) => {
  try {
    const { description, specializations, establishedYear, services, accreditation, website, socialLinks } = req.body;

    let hospitalProfile = await HospitalProfile.findOne({ hospital: req.user.id });

    if (!hospitalProfile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    hospitalProfile.description = description || hospitalProfile.description;
    hospitalProfile.specializations = specializations || hospitalProfile.specializations;
    hospitalProfile.establishedYear = establishedYear || hospitalProfile.establishedYear;
    hospitalProfile.services = services || hospitalProfile.services;
    hospitalProfile.accreditation = accreditation || hospitalProfile.accreditation;
    hospitalProfile.website = website || hospitalProfile.website;
    hospitalProfile.socialLinks = socialLinks || hospitalProfile.socialLinks;

    await hospitalProfile.save();

    res.json({ message: "Profile updated successfully", data: hospitalProfile });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

/**
 * @desc Delete Hospital Profile
 * @route DELETE /api/hospital/profile
 * @access Private (Hospital)
 */
exports.deleteHospitalProfile = async (req, res) => {
  try {
    const profile = await HospitalProfile.findOneAndDelete({ hospital: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Hospital profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};
