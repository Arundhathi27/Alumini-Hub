const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const verifyPasswords = async () => {
    try {
        const users = await User.find({});
        console.log(`Verifying ${users.length} users...`);

        for (const user of users) {
            const isMatch = await bcrypt.compare('user@123', user.password);
            console.log(`[${user.role}] ${user.email}: ${isMatch ? 'VALID' : 'INVALID'}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyPasswords();
