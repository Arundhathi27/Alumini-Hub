const Job = require('../models/Job');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a new job post
// @route   POST /api/alumni/jobs
// @access  Private (Alumni Only)
const createJob = async (req, res) => {
    try {
        // Enforce Verification Check
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Only verified alumni can post jobs.' });
        }

        const {
            title,
            company,
            role,
            type,
            location,
            skills,
            experience,
            description,
            applyLink
        } = req.body;

        if (!title || !company || !role || !type || !location || !skills || !experience || !description || !applyLink) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const job = await Job.create({
            title,
            company,
            role,
            type,
            location,
            skills, // Assuming skills is already an array or needs parsing if sent as string
            experience,
            description,
            applyLink,
            postedBy: req.user._id,
            status: 'Pending'
        });

        // NOTIFICATION Trigger (Notify Admins & Staff)
        const io = req.app.get('io');
        const adminsAndStaff = await User.find({ role: { $in: ['Admin', 'Staff'] } });

        for (const admin of adminsAndStaff) {
            await createNotification(io, {
                recipientId: admin._id,
                senderId: req.user._id,
                type: 'job_status',
                title: 'New Job Approval Request',
                message: `${req.user.name} posted a new job: "${job.title}". Verification required.`,
                relatedId: job._id
            });
        }

        res.status(201).json(job);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs posted by logged-in alumni
// @route   GET /api/alumni/jobs
// @access  Private (Alumni Only)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (Admin) - Supports filtering by status
// @route   GET /api/alumni/jobs/all
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
    try {
        const { status } = req.query;
        console.log('Admin getAllJobs request:', { status, user: req.user._id });

        let query = {};
        if (status) {
            query.status = status;
        }

        console.log('Querying Jobs with:', query);
        const jobs = await Job.find(query).populate('postedBy', 'name email').sort({ createdAt: -1 });
        console.log(`Found ${jobs.length} jobs`);

        res.json(jobs);
    } catch (error) {
        console.error('Error in getAllJobs:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Job Status (Admin)
// @route   PUT /api/alumni/jobs/:id/status
// @access  Private (Admin)
const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = status;
        await job.save();

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job post
// @route   PUT /api/alumni/jobs/:id
// @access  Private (Alumni Only)
const updateJob = async (req, res) => {
    try {
        const {
            title,
            company,
            role,
            type,
            location,
            skills,
            experience,
            description,
            applyLink
        } = req.body;

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check status (Can only edit if 'Pending')
        if (job.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot edit job after it has been processed.' });
        }

        job.title = title || job.title;
        job.company = company || job.company;
        job.role = role || job.role;
        job.type = type || job.type;
        job.location = location || job.location;
        job.skills = skills || job.skills;
        job.experience = experience || job.experience;
        job.description = description || job.description;
        job.applyLink = applyLink || job.applyLink;

        await job.save();

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getMyJobs,
    getAllJobs,
    updateJobStatus,
    updateJob
};
