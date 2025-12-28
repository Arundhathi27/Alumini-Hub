const User = require('../models/User');
const Department = require('../models/Department');
const bcrypt = require('bcryptjs');

// @desc    Create a new user (Staff, Student, Alumni)
// @route   POST /api/admin/create-user
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, batchYear, department } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Set default isVerified based on role
        // Staff/Student/Admin are verified by default if created by Admin
        // Alumni created by Admin are also verified (usually) but let's stick to the rule: 
        // "Newly created Alumni must be isVerified = false" unless explicitly overridden, 
        // but typically admin creation implies trust. However, the requirement says "Newly created Alumni must be isVerified = false".
        // Let's check requirements: "Newly created Alumni must be isVerified = false". OK.

        let isVerified = true;
        if (role === 'Alumni') {
            isVerified = false;
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            batchYear,
            department,
            isVerified
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users based on role
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }

        // Exclude password from result
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Alumni
// @route   PUT /api/admin/verify-alumni/:id
// @access  Private/Admin
const verifyAlumni = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isVerified = req.body.isVerified;
            // Also reject if isVerified is set to false explicitly? 
            // Or maybe we treat "Rejected" as isVerified=false?
            // The prompt says "Approve / Reject Alumni". And "Status (Pending / Verified / Rejected)".
            // But Schema only has isVerified (boolean). 
            // Let's assume isVerified=true (Verified), isVerified=false (Pending/Rejected).
            // For now, toggle verification.

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Activate/Deactivate User
// @route   PUT /api/admin/activate-user/:id
// @access  Private/Admin
const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isActive = req.body.isActive;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new department
// @route   POST /api/admin/create-department
// @access  Private/Admin
const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;

        const departmentExists = await Department.findOne({ name });

        if (departmentExists) {
            return res.status(400).json({ message: 'Department already exists' });
        }

        const department = await Department.create({
            name,
        });

        if (department) {
            res.status(201).json(department);
        } else {
            res.status(400).json({ message: 'Invalid department data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private/Admin
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update user details
// @route   PUT /api/admin/update-user/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.department = req.body.department || user.department;
            user.batchYear = req.body.batchYear || user.batchYear;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                batchYear: updatedUser.batchYear
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/delete-user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    verifyAlumni,
    activateUser,
    createDepartment,
    getDepartments,
    updateUser,
    deleteUser
};
