const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// @desc    Get current alumni profile
// @route   GET /api/alumni/profile
// @access  Private (Alumni only)
const getProfile = async (req, res) => {
    try {
        let profile = await AlumniProfile.findOne({ user: req.user._id }).populate('user', 'name email role batchYear department isVerified');

        if (!profile) {
            // If profile doesn't exist yet, return structure with user data
            // We don't create it in DB until they save, or we can create a blank one now.
            // Let's return a constructed object to frontend
            profile = {
                user: req.user,
                phone: '',
                about: '',
                location: '',
                workExperience: { currentCompany: '', designation: '', industry: '', yearsOfExperience: 0 },
                skills: [],
                socialLinks: { linkedin: '', github: '', portfolio: '' },
                completionPercentage: 0
            };
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/profile
// @access  Private (Alumni only)
const updateProfile = async (req, res) => {
    try {
        const {
            name, // from User model
            phone, about, location,
            currentCompany, designation, industry, yearsOfExperience,
            skills,
            linkedin, github, portfolio
        } = req.body;

        // 1. Update User Record (Name only)
        const user = await User.findById(req.user._id);
        if (name && user.name !== name) {
            user.name = name;
            await user.save();
        }

        // 2. Update/Create Alumni Profile
        let profile = await AlumniProfile.findOne({ user: req.user._id });

        if (!profile) {
            profile = new AlumniProfile({ user: req.user._id });
        }

        profile.phone = phone || profile.phone;
        profile.about = about || profile.about;
        profile.location = location || profile.location;

        // Work Exp
        profile.workExperience.currentCompany = currentCompany || '';
        profile.workExperience.designation = designation || '';
        profile.workExperience.industry = industry || '';
        profile.workExperience.yearsOfExperience = yearsOfExperience || 0;

        // Skills (Ensure array)
        if (skills) {
            profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        }

        // Social
        profile.socialLinks.linkedin = linkedin || '';
        profile.socialLinks.github = github || '';
        profile.socialLinks.portfolio = portfolio || '';

        const updatedProfile = await profile.save();

        // Re-populate user to return full object
        const fullProfile = await AlumniProfile.findById(updatedProfile._id).populate('user', 'name email role batchYear department isVerified');

        res.json(fullProfile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProfile, updateProfile };
