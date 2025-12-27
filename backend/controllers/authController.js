const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // 3. Role-specific validation

        // Alumni: Must be Verified
        if (user.role === 'Alumni' && !user.isVerified) {
            return res.status(403).json({ message: 'Account pending verification. Please contact admin.' });
        }

        // Student & Staff: Must be Active
        if ((['Student', 'Staff'].includes(user.role)) && !user.isActive) {
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }

        // 4. Return success with Token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { loginUser };
