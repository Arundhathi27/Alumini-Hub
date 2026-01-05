const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const simulateLogin = async () => {
    try {
        const email = 'alumni@example.com';
        const password = 'user@123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        const isMatch = await user.matchPassword(password);
        console.log(`Email exists: ${user.email}`);
        console.log(`Password match: ${isMatch}`);
        console.log(`Is Verified: ${user.isVerified}`);
        console.log(`Is Active: ${user.isActive}`);

        if (isMatch && user.isVerified && user.isActive) {
            console.log('LOGIN SUCCESSFUL');
        } else {
            console.log('LOGIN FAILED');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

simulateLogin();
