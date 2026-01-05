const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany(); // Clear existing users

        // Helper to hash password
        const hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        };

        const hashedPassword = await hashPassword('user@123');

        const users = [
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'Admin',
                isActive: true,
                isVerified: true
            },
            {
                name: 'John Staff',
                email: 'staff@example.com',
                password: hashedPassword,
                role: 'Staff',
                isActive: true
            },
            {
                name: 'Jane Alumni',
                email: 'alumni@example.com',
                password: hashedPassword,
                role: 'Alumni',
                isActive: true,
                isVerified: true // Verified
            },
            {
                name: 'Pending Alumni',
                email: 'pending@example.com',
                password: hashedPassword,
                role: 'Alumni',
                isActive: true,
                isVerified: false // Not Verified
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: hashedPassword,
                role: 'Student',
                isActive: true
            }
        ];

        await User.insertMany(users);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedUsers();
