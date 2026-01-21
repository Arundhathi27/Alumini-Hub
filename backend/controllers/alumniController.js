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

// @desc    Get all verified alumni for directory
// @route   GET /api/alumni
// @access  Private (Admin, Staff, Student)
const getVerifiedAlumni = async (req, res) => {
    try {
        const { name, batch, company, role, location, skills } = req.query;

        // Query only verified and active users
        let userQuery = { isVerified: true, isActive: true, role: 'Alumni' };

        if (name) {
            userQuery.name = { $regex: name, $options: 'i' };
        }
        if (batch) {
            userQuery.batchYear = batch;
        }

        // Get all verified alumni users
        const users = await User.find(userQuery).select('name batchYear department').lean();
        const userIds = users.map(u => u._id);

        // Get profiles for these users
        let profileQuery = { user: { $in: userIds } };

        if (company) {
            profileQuery['workExperience.currentCompany'] = { $regex: company, $options: 'i' };
        }
        if (role) {
            profileQuery['workExperience.designation'] = { $regex: role, $options: 'i' };
        }
        if (location) {
            profileQuery.location = { $regex: location, $options: 'i' };
        }
        if (skills) {
            profileQuery.skills = { $regex: skills, $options: 'i' };
        }

        const profiles = await AlumniProfile.find(profileQuery).populate('user', 'name batchYear department').lean();

        // Create a map of user ID to profile
        const profileMap = {};
        profiles.forEach(profile => {
            profileMap[profile.user._id.toString()] = profile;
        });

        // Build result: include all users, with profile if available
        const result = users.map(user => {
            const profile = profileMap[user._id.toString()];
            if (profile) {
                return profile;
            } else {
                // Return minimal data if no profile exists
                return {
                    user: user,
                    phone: '',
                    about: '',
                    location: '',
                    workExperience: { currentCompany: '', designation: '', industry: '', yearsOfExperience: 0 },
                    skills: [],
                    socialLinks: { linkedin: '', github: '', portfolio: '' }
                };
            }
        });

        // Apply company/role/location/skills filters on the result
        let filteredResult = result;
        if (company) {
            filteredResult = filteredResult.filter(r =>
                r.workExperience?.currentCompany?.toLowerCase().includes(company.toLowerCase())
            );
        }
        if (role) {
            filteredResult = filteredResult.filter(r =>
                r.workExperience?.designation?.toLowerCase().includes(role.toLowerCase())
            );
        }
        if (location) {
            filteredResult = filteredResult.filter(r =>
                r.location?.toLowerCase().includes(location.toLowerCase())
            );
        }
        if (skills) {
            filteredResult = filteredResult.filter(r =>
                r.skills?.some(skill => skill.toLowerCase().includes(skills.toLowerCase()))
            );
        }

        res.json(filteredResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProfile, updateProfile, getVerifiedAlumni };
