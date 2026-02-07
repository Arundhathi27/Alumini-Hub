const User = require('../models/User');
const Department = require('../models/Department');
const bcrypt = require('bcryptjs');
const xlsx = require('xlsx');
const generateToken = require('../utils/generateToken');

const sendEmail = require('../utils/emailService');

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
        let isVerified = true;
        if (role === 'Alumni' || role === 'Student' || role === 'Staff') {
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
            // Send Welcome Email
            const emailSubject = `Welcome to Alumni Hub - ${role} Account Details`;
            const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4f46e5; text-align: center;">Welcome to Alumni Hub!</h2>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Your <strong>${role}</strong> account has been successfully created by the administrator.</p>

                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #4f46e5;">
                    <h3 style="margin-top: 0; color: #1f2937; margin-bottom: 15px;">Your Login Credentials</h3>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${email}</span></p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${password}</span></p>
                    <p style="margin: 10px 0; font-size: 14px; color: #6b7280;"><strong>Role:</strong> ${role}</p>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Login to your account using the credentials above.</li>
                    <li>Update your profile information.</li>
                    <li>Change your password for security purposes.</li>
                </ol>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173/login" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
                </div>

                <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">This is an automated message. Please do not reply to this email.</p>
            </div>
            `;
            await sendEmail({ to: email, subject: emailSubject, html: emailHtml });

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

// @desc    Verify User (Alumni / Student)
// @route   PUT /api/admin/verify-user/:id
// @access  Private/Admin
const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isVerified = req.body.isVerified;
            const updatedUser = await user.save();

            // Send Verification Email
            if (updatedUser.isVerified) {
                let emailSubject = 'Account Verified - Alumni Hub';
                let emailHtml = '';

                if (user.role === 'Alumni') {
                    emailSubject = 'Alumni Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Great news! Your <strong>Alumni</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                        <p>You now have full access to the Alumni Hub features, including:</p>
                        <ul>
                            <li>Posting new job opportunities</li>
                            <li>Connecting with other alumni</li>
                            <li>Mentoring students</li>
                        </ul>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Account</a>
                        </div>
                         
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Thank you for being a valued member of our alumni community.</p>
                    </div>
                `;
                } else if (user.role === 'Student') {
                    emailSubject = 'Student Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Great news! Your <strong>Student</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                        <p>You now have full access to Student features.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Account</a>
                        </div>
                         
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Welcome to the community!</p>
                    </div>
                `;
                } else if (user.role === 'Staff') {
                    emailSubject = 'Staff Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Your <strong>Staff</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                        <p>You now have full access to the Alumni Hub Staff Dashboard.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
                        </div>
                         
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Welcome to the Alumni Hub team!</p>
                    </div>
                `;
                }

                if (emailHtml) {
                    await sendEmail({ to: user.email, subject: emailSubject, html: emailHtml });
                }
            }

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isVerified: updatedUser.isVerified,
                token: generateToken(updatedUser._id) // Might not need token here, but keeping it
            });

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

// @desc    Bulk upload users from Excel
// @route   POST /api/admin/bulk-upload
// @access  Private/Admin
const bulkUploadUsers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel sheet is empty' });
        }

        const report = {
            total: data.length,
            added: 0,
            failed: 0,
            errors: []
        };

        const { role } = req.body; // 'Alumni', 'Student', 'Staff' passed from frontend

        for (const [index, row] of data.entries()) {
            const {
                Name,
                Email,
                'Register No.': RegisterNo,
                Department: DeptName,
                Batch,
                'Date of Birth': DOB,
                'Full Address': FullAddr,
                'Blood Group': BloodGrp,
                'Phone Number': Phone,
                Role: fileRole
            } = row;
            // Use role from file if present, else from request body
            const userRole = fileRole || role;

            // Basic Validation
            if (!Name || !Email) {
                report.failed++;
                report.errors.push(`Row ${index + 2}: Missing Name or Email`);
                continue;
            }

            // Additional validation for Alumni
            if (userRole === 'Alumni') {
                if (!RegisterNo) {
                    report.failed++;
                    report.errors.push(`Row ${index + 2}: Missing Register No. for Alumni`);
                    continue;
                }
                if (!Phone) {
                    report.failed++;
                    report.errors.push(`Row ${index + 2}: Missing Phone Number for Alumni`);
                    continue;
                }
                if (!DOB) {
                    report.failed++;
                    report.errors.push(`Row ${index + 2}: Missing Date of Birth for Alumni`);
                    continue;
                }
            }

            try {
                // Check if user exists
                const userExists = await User.findOne({ email: Email });
                if (userExists) {
                    report.failed++;
                    report.errors.push(`Row ${index + 2}: User ${Email} already exists`);
                    continue;
                }

                // Parse Date of Birth if provided
                let parsedDOB = null;
                if (DOB) {
                    // Handle Excel date formats (can be serial number or string)
                    if (typeof DOB === 'number') {
                        // Excel serial date conversion (Excel epoch is Dec 30, 1899)
                        parsedDOB = new Date((DOB - 25569) * 86400 * 1000);
                    } else {
                        // Try parsing as string - handles multiple formats
                        const dobStr = DOB.toString().trim();

                        // Try different date formats
                        if (dobStr.includes('.')) {
                            // DD.MM.YYYY format
                            const parts = dobStr.split('.');
                            if (parts.length === 3) {
                                parsedDOB = new Date(parts[2], parts[1] - 1, parts[0]);
                            }
                        } else if (dobStr.includes('/')) {
                            // MM/DD/YYYY format
                            parsedDOB = new Date(dobStr);
                        } else if (dobStr.includes('-')) {
                            // YYYY-MM-DD format
                            parsedDOB = new Date(dobStr);
                        } else {
                            parsedDOB = new Date(dobStr);
                        }
                    }

                    if (!parsedDOB || isNaN(parsedDOB.getTime())) {
                        report.failed++;
                        report.errors.push(`Row ${index + 2}: Invalid Date of Birth format`);
                        continue;
                    }
                }

                // Default values
                let isVerified = true;
                if (userRole === 'Alumni' || userRole === 'Student' || userRole === 'Staff') isVerified = false;

                // Create User with all fields
                const userData = {
                    name: Name,
                    email: Email,
                    password: 'user@123', // Default Password
                    role: userRole,
                    department: DeptName,
                    batchYear: Batch,
                    isVerified
                };

                // Add alumni-specific fields if role is Alumni
                if (userRole === 'Alumni') {
                    userData.registerNo = RegisterNo;
                    userData.dateOfBirth = parsedDOB;
                    userData.fullAddress = FullAddr || '';
                    userData.bloodGroup = BloodGrp || '';
                    userData.phoneNumber = Phone;
                }

                const newUser = await User.create(userData);

                // Send Welcome Email
                const emailSubject = `Welcome to Alumni Hub - ${userRole} Account Details`;
                const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #4f46e5; text-align: center;">Welcome to Alumni Hub!</h2>
                    <p>Dear <strong>${Name}</strong>,</p>
                    <p>Your <strong>${userRole}</strong> account has been successfully created by the administrator.</p>

                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #4f46e5;">
                        <h3 style="margin-top: 0; color: #1f2937; margin-bottom: 15px;">Your Login Credentials</h3>
                        <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${Email}</span></p>
                        <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                        <p style="margin: 10px 0; font-size: 14px; color: #6b7280;"><strong>Role:</strong> ${userRole}</p>
                    </div>

                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Login to your account using the credentials above.</li>
                        <li>Update your profile information.</li>
                        <li>Change your password for security purposes.</li>
                    </ol>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5173/login" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
                    </div>

                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">This is an automated message. Please do not reply to this email.</p>
                </div>
                `;
                await sendEmail({ to: Email, subject: emailSubject, html: emailHtml });

                report.added++;
            } catch (err) {
                report.failed++;
                report.errors.push(`Row ${index + 2}: ${err.message}`);
            }
        }

        res.json({ message: 'Bulk upload completed', report });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk Verify Users
// @route   POST /api/admin/users/bulk-verify
// @access  Private/Admin
const bulkVerifyUsers = async (req, res) => {
    try {
        const { userIds, isVerified } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'User IDs array is required' });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            { $set: { isVerified } }
        );

        if (isVerified) {
            const users = await User.find({ _id: { $in: userIds } });

            for (const user of users) {
                let emailSubject = 'Account Verified - Alumni Hub';
                let emailHtml = '';

                if (user.role === 'Alumni') {
                    emailSubject = 'Alumni Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Great news! Your <strong>Alumni</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                         <p>You now have full access to the Alumni Hub features, including:</p>
                        <ul>
                            <li>Posting new job opportunities</li>
                            <li>Connecting with other alumni</li>
                            <li>Mentoring students</li>
                        </ul>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Account</a>
                        </div>
                        
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Thank you for being a valued member of our alumni community.</p>
                    </div>
                `;
                } else if (user.role === 'Student') {
                    emailSubject = 'Student Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Great news! Your <strong>Student</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                         <p>You now have full access to Student features.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Account</a>
                        </div>
                        
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Welcome to the community!</p>
                    </div>
                `;
                } else if (user.role === 'Staff') {
                    emailSubject = 'Staff Account Verified - Alumni Hub';
                    emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #10b981; text-align: center;">Account Verified!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Your <strong>Staff</strong> account has been <strong>verified</strong> by the administrator.</p>
                        
                        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 5px solid #10b981;">
                            <h3 style="margin-top: 0; color: #064e3b; margin-bottom: 15px;">Your Login Credentials</h3>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Mail ID:</strong> <span style="color: #374151;">${user.email}</span></p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">user@123</span></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #6b7280;">(Use this default password if you haven't set one yet)</p>
                        </div>

                        <p>You now have full access to the Alumni Hub Staff Dashboard.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
                        </div>
                         
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #6b7280; text-align: center;">Welcome to the Alumni Hub team!</p>
                    </div>
                `;
                }

                if (emailHtml) {
                    await sendEmail({ to: user.email, subject: emailSubject, html: emailHtml });
                }
            }
        }

        res.json({
            success: true,
            modified: result.modifiedCount,
            message: `${result.modifiedCount} user(s) ${isVerified ? 'verified' : 'unverified'} successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk Delete Users
// @route   DELETE /api/admin/users/bulk-delete
// @access  Private/Admin
const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'User IDs array is required' });
        }

        const result = await User.deleteMany({ _id: { $in: userIds } });

        res.json({
            success: true,
            deleted: result.deletedCount,
            message: `${result.deletedCount} user(s) deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    verifyUser,
    activateUser,
    createDepartment,
    getDepartments,
    updateUser,
    deleteUser,
    bulkUploadUsers,
    bulkVerifyUsers,
    bulkDeleteUsers
};
