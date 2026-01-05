const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const updatePasswords = async () => {
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users to update.`);

        for (const user of users) {
            user.password = 'user@123';
            user.isVerified = true;
            user.isActive = true;
            await user.save();
            console.log(`Updated & Verified: ${user.email}`);
        }

        console.log('All passwords updated successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error updating passwords: ${error.message}`);
        process.exit(1);
    }
};

updatePasswords();
