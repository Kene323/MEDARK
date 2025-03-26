const Profile = require("../model/profileModel");

/**
 * @desc Create or Update User Profile
 * @route POST /api/profile
 * @access Private (User)
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { profession, bio, experience, phone, location } = req.body;

    console.log("Received Data:", req.body);
    console.log("Received Files:", req.files);

    // Get uploaded file URLs from Cloudinary
    const profilePicture = req.files?.profilePicture ? req.files.profilePicture[0].path : null;
    const resume = req.files?.resume ? req.files.resume[0].path : null;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile.profession = profession || profile.profession;
      profile.bio = bio || profile.bio;
      profile.experience = experience || profile.experience;
      profile.phone = phone || profile.phone;
      profile.location = location || profile.location;
      if (profilePicture) profile.profilePicture = profilePicture;
      if (resume) profile.resume = resume;

      await profile.save();
      return res.json({ message: "Profile updated successfully", data: profile });
    }

    // Create new profile
    profile = new Profile({
      user: req.user.id,
      profession,
      bio,
      experience,
      phone,
      location,
      profilePicture,
      resume,
    });

    await profile.save();
    res.status(201).json({ message: "Profile created successfully", data: profile });
  } catch (error) {
    console.error("Error:", error); // Log the actual error
    res.status(500).json({ message: "Error saving profile", error: error.message });
  }
};

/**
 * @desc Get All Profiles
 * @route GET /api/profiles
 * @access Public
 */
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "-password");
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};

/**
 * @desc Get Profile by User ID
 * @route GET /api/profile/:userId
 * @access Private (User)
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error });
  }
};

/**
 * @desc Delete User Profile
 * @route DELETE /api/profile
 * @access Private (User)
 */
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};

/**
 * @desc Upload Profile Picture
 * @route POST /api/profile/upload-picture
 * @access Private (User)
 */
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const profilePictureUrl = req.file.path; // Cloudinary URL
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile picture updated successfully", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};

/**
 * @desc Upload Resume
 * @route POST /api/profile/upload-resume
 * @access Private (User)
 */
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const resumeUrl = req.file.path; // Cloudinary URL
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { resume: resumeUrl },
      { new: true }
    );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Resume uploaded successfully", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Error uploading resume", error });
  }
};
