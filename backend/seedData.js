const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Job = require('./models/Job');
const Event = require('./models/Event');
const Department = require('./models/Department');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedAll = async () => {
    try {
        console.log('🌱 Starting seed...');

        // ── Clear existing data ──────────────────────────────────────
        await User.deleteMany({});
        await Job.deleteMany({});
        await Event.deleteMany({});
        await Department.deleteMany({});
        console.log('✅ Cleared existing data');

        // ── Hash passwords ────────────────────────────────────────────
        const adminPass = await hashPassword('admin@123');
        const userPass = await hashPassword('user@123');

        // ── Departments ───────────────────────────────────────────────
        const departments = await Department.insertMany([
            { name: 'Computer Science & Engineering' },
            { name: 'Electronics & Communication Engineering' },
            { name: 'Mechanical Engineering' },
            { name: 'Civil Engineering' },
            { name: 'Information Technology' },
            { name: 'Artificial Intelligence & Data Science' },
        ]);
        console.log(`✅ Created ${departments.length} departments`);

        // ── Users ─────────────────────────────────────────────────────
        const users = await User.insertMany([
            // Admin
            {
                name: 'System Admin',
                email: 'admin@alumhub.com',
                password: adminPass,
                role: 'Admin',
                isActive: true,
                isVerified: true,
            },
            // Staff
            {
                name: 'Dr. Priya Sharma',
                email: 'priya.sharma@alumhub.com',
                password: userPass,
                role: 'Staff',
                department: 'Computer Science & Engineering',
                isActive: true,
                isVerified: true,
            },
            {
                name: 'Prof. Ramesh Kumar',
                email: 'ramesh.kumar@alumhub.com',
                password: userPass,
                role: 'Staff',
                department: 'Electronics & Communication Engineering',
                isActive: true,
                isVerified: false,
            },
            // Verified Alumni
            {
                name: 'Arjun Mehta',
                email: 'arjun.mehta@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Computer Science & Engineering',
                batchYear: '2020',
                isActive: true,
                isVerified: true,
                phoneNumber: '9876543210',
                registerNo: 'CSE20001',
            },
            {
                name: 'Sneha Patel',
                email: 'sneha.patel@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Information Technology',
                batchYear: '2021',
                isActive: true,
                isVerified: true,
                phoneNumber: '9876543211',
                registerNo: 'IT21002',
            },
            {
                name: 'Vikram Singh',
                email: 'vikram.singh@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Electronics & Communication Engineering',
                batchYear: '2019',
                isActive: true,
                isVerified: true,
                phoneNumber: '9876543212',
                registerNo: 'ECE19003',
            },
            {
                name: 'Deepa Nair',
                email: 'deepa.nair@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Mechanical Engineering',
                batchYear: '2018',
                isActive: true,
                isVerified: true,
                phoneNumber: '9876543213',
                registerNo: 'MECH18004',
            },
            // Pending Alumni (unverified)
            {
                name: 'Rahul Verma',
                email: 'rahul.verma@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Computer Science & Engineering',
                batchYear: '2022',
                isActive: true,
                isVerified: false,
                phoneNumber: '9876543214',
                registerNo: 'CSE22005',
            },
            {
                name: 'Anjali Reddy',
                email: 'anjali.reddy@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Artificial Intelligence & Data Science',
                batchYear: '2023',
                isActive: true,
                isVerified: false,
                phoneNumber: '9876543215',
                registerNo: 'AIDS23006',
            },
            {
                name: 'Karthik Rajan',
                email: 'karthik.rajan@gmail.com',
                password: userPass,
                role: 'Alumni',
                department: 'Information Technology',
                batchYear: '2022',
                isActive: true,
                isVerified: false,
                phoneNumber: '9876543216',
                registerNo: 'IT22007',
            },
            // Students
            {
                name: 'Aditya Kumar',
                email: 'aditya.kumar@student.alumhub.com',
                password: userPass,
                role: 'Student',
                department: 'Computer Science & Engineering',
                batchYear: '2025',
                isActive: true,
                isVerified: true,
            },
            {
                name: 'Priya Krishnan',
                email: 'priya.krishnan@student.alumhub.com',
                password: userPass,
                role: 'Student',
                department: 'Artificial Intelligence & Data Science',
                batchYear: '2026',
                isActive: true,
                isVerified: true,
            },
            {
                name: 'Siddharth Rao',
                email: 'siddharth.rao@student.alumhub.com',
                password: userPass,
                role: 'Student',
                department: 'Electronics & Communication Engineering',
                batchYear: '2025',
                isActive: true,
                isVerified: false,
            },
        ]);
        console.log(`✅ Created ${users.length} users`);

        // Get reference IDs
        const verifiedAlumni = users.filter(u => u.role === 'Alumni' && u.isVerified);
        const adminUser = users.find(u => u.role === 'Admin');

        // ── Jobs ──────────────────────────────────────────────────────
        const jobs = await Job.insertMany([
            // Pending jobs
            {
                title: 'Software Engineer',
                company: 'Google',
                role: 'Backend Developer',
                type: 'Full-time',
                location: 'Bangalore, India',
                skills: ['Node.js', 'MongoDB', 'React', 'AWS'],
                experience: '2-4 years',
                description: 'We are looking for a skilled backend developer to join our team at Google. You will work on large-scale distributed systems.',
                applyLink: 'https://careers.google.com/jobs/123',
                postedBy: verifiedAlumni[0]._id,
                status: 'Pending',
            },
            {
                title: 'Data Scientist',
                company: 'Microsoft',
                role: 'ML Engineer',
                type: 'Full-time',
                location: 'Hyderabad, India',
                skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
                experience: '1-3 years',
                description: 'Join Microsoft\'s AI team to build next-generation machine learning models for Azure services.',
                applyLink: 'https://careers.microsoft.com/jobs/456',
                postedBy: verifiedAlumni[1]._id,
                status: 'Pending',
            },
            {
                title: 'Frontend Developer',
                company: 'Flipkart',
                role: 'UI Engineer',
                type: 'Full-time',
                location: 'Bangalore, India',
                skills: ['React', 'TypeScript', 'CSS', 'Redux'],
                experience: '1-2 years',
                description: 'Build beautiful and performant user interfaces for India\'s largest e-commerce platform.',
                applyLink: 'https://careers.flipkart.com/jobs/789',
                postedBy: verifiedAlumni[2]._id,
                status: 'Pending',
            },
            // Approved jobs
            {
                title: 'DevOps Engineer',
                company: 'Amazon',
                role: 'Cloud Infrastructure Engineer',
                type: 'Full-time',
                location: 'Remote',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
                experience: '3-5 years',
                description: 'Help build and maintain Amazon\'s cloud infrastructure. Work with cutting-edge DevOps technologies.',
                applyLink: 'https://amazon.jobs/jobs/321',
                postedBy: verifiedAlumni[0]._id,
                status: 'Approved',
            },
            {
                title: 'Android Developer',
                company: 'Swiggy',
                role: 'Mobile Developer',
                type: 'Full-time',
                location: 'Chennai, India',
                skills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'REST APIs'],
                experience: '0-2 years',
                description: 'Build Swiggy\'s next-generation Android app used by millions of users daily.',
                applyLink: 'https://swiggy.com/careers/654',
                postedBy: verifiedAlumni[1]._id,
                status: 'Approved',
            },
            {
                title: 'Internship - Software Development',
                company: 'TCS',
                role: 'Intern',
                type: 'Internship',
                location: 'Chennai, India',
                skills: ['Java', 'Spring Boot', 'MySQL'],
                experience: '0 years (Fresher)',
                description: 'A 6-month internship program at TCS for final-year students. Get hands-on industry experience.',
                applyLink: 'https://tcs.com/careers/internship',
                postedBy: verifiedAlumni[2]._id,
                status: 'Approved',
            },
        ]);
        console.log(`✅ Created ${jobs.length} jobs (${jobs.filter(j => j.status === 'Pending').length} pending, ${jobs.filter(j => j.status === 'Approved').length} approved)`);

        // ── Events ────────────────────────────────────────────────────
        const today = new Date('2026-03-06');
        const futureDate1 = new Date('2026-03-20');
        const futureDate2 = new Date('2026-04-05');
        const futureDate3 = new Date('2026-04-15');
        const pastDate1 = new Date('2026-02-15');

        const events = await Event.insertMany([
            // Pending events
            {
                title: 'Alumni Networking Night 2026',
                type: 'Alumni Meet',
                description: 'An exclusive networking event for all alumni. Connect with fellow graduates, share experiences, and explore new opportunities.',
                date: '2026-03-20',
                time: '06:00 PM',
                mode: 'Offline',
                location: 'Main Auditorium, College Campus',
                postedBy: verifiedAlumni[0]._id,
                status: 'Pending',
            },
            {
                title: 'AI & Machine Learning Workshop',
                type: 'Workshop',
                description: 'A hands-on workshop covering the latest advancements in AI and ML. Learn to build real-world models from industry experts.',
                date: '2026-04-05',
                time: '10:00 AM',
                mode: 'Online',
                link: 'https://meet.google.com/abc-defg-hij',
                postedBy: verifiedAlumni[1]._id,
                status: 'Pending',
            },
            {
                title: 'Career Guidance Webinar',
                type: 'Webinar',
                description: 'Expert alumni share career tips, interview strategies, and how to land your dream job in top tech companies.',
                date: '2026-04-15',
                time: '04:00 PM',
                mode: 'Online',
                link: 'https://zoom.us/j/123456789',
                postedBy: verifiedAlumni[2]._id,
                status: 'Pending',
            },
            // Approved/Upcoming events
            {
                title: 'Tech Talk: Future of Cloud Computing',
                type: 'Webinar',
                description: 'Senior engineers from AWS and Azure discuss the future of cloud computing and its impact on software development.',
                date: '2026-03-25',
                time: '03:00 PM',
                mode: 'Online',
                link: 'https://youtube.com/live/techtalks2026',
                postedBy: verifiedAlumni[0]._id,
                status: 'Approved',
            },
            {
                title: 'Annual Alumni Meet 2026',
                type: 'Alumni Meet',
                description: 'The grand annual gathering of all alumni across all batches. Celebrate achievements, reconnect with batchmates, and inspire current students.',
                date: '2026-04-20',
                time: '11:00 AM',
                mode: 'Offline',
                location: 'College Sports Ground & Auditorium',
                postedBy: adminUser._id,
                status: 'Approved',
            },
            {
                title: 'Entrepreneurship Meetup',
                type: 'Meetup',
                description: 'Alumni entrepreneurs share their startup journey and provide guidance to aspiring student founders.',
                date: '2026-04-10',
                time: '05:00 PM',
                mode: 'Offline',
                location: 'Innovation Hub, Block C',
                postedBy: verifiedAlumni[3]._id,
                status: 'Approved',
            },
        ]);
        console.log(`✅ Created ${events.length} events (${events.filter(e => e.status === 'Pending').length} pending, ${events.filter(e => e.status === 'Approved').length} approved)`);

        // ── Summary ───────────────────────────────────────────────────
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ✅ Database seeded successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📊 Summary:');
        console.log(`  👤 Users        : ${users.length} total`);
        console.log(`     → Admin      : ${users.filter(u => u.role === 'Admin').length}`);
        console.log(`     → Staff      : ${users.filter(u => u.role === 'Staff').length}`);
        console.log(`     → Alumni     : ${users.filter(u => u.role === 'Alumni').length} (${users.filter(u => u.role === 'Alumni' && u.isVerified).length} verified, ${users.filter(u => u.role === 'Alumni' && !u.isVerified).length} pending)`);
        console.log(`     → Students   : ${users.filter(u => u.role === 'Student').length}`);
        console.log(`  🏢 Departments  : ${departments.length}`);
        console.log(`  💼 Jobs         : ${jobs.length} (${jobs.filter(j => j.status === 'Pending').length} pending, ${jobs.filter(j => j.status === 'Approved').length} approved)`);
        console.log(`  📅 Events       : ${events.length} (${events.filter(e => e.status === 'Pending').length} pending, ${events.filter(e => e.status === 'Approved').length} approved)`);
        console.log('\n🔐 Login Credentials:');
        console.log('  Admin  → admin@alumhub.com       / admin@123');
        console.log('  Alumni → arjun.mehta@gmail.com   / user@123');
        console.log('  Staff  → priya.sharma@alumhub.com / user@123');
        console.log('  Student→ aditya.kumar@student.alumhub.com / user@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedAll();
