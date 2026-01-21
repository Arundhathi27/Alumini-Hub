
const Job = require('../models/Job');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all pending jobs (Admin & Staff)
// @route   GET /api/jobs/pending
// @access  Private (Admin, Staff)
const getPendingJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Pending' })
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify (Approve/Reject) a job
// @route   PUT /api/jobs/verify
// @access  Private (Admin, Staff)
const verifyJob = async (req, res) => {
    try {
        const { jobId, action } = req.body;

        if (!jobId || !action) {
            return res.status(400).json({ message: 'Job ID and action are required' });
        }

        if (!['Approve', 'Reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Must be Approve or Reject' });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = action === 'Approve' ? 'Approved' : 'Rejected';

        // Optional: Track who verified it
        // job.verifiedBy = req.user._id;

        await job.save();

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all APPROVED jobs (Public/Student/Staff/Alumni)
// @route   GET /api/jobs
// @access  Private (All Roles)
const getApprovedJobs = async (req, res) => {
    try {
        const { title, company, location, type, role } = req.query;

        let query = { status: 'Approved' };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }
        if (role) {
            query.role = { $regex: role, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (type && type !== 'All') {
            query.type = type;
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all PENDING events for verification
// @route   GET /api/events/pending
// @access  Private (Admin, Staff)
const getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'Pending' })
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify (Approve/Reject) an event
// @route   PUT /api/events/verify
// @access  Private (Admin, Staff)
const verifyEvent = async (req, res) => {
    try {
        const { eventId, action } = req.body; // action: 'Approve' or 'Reject'

        if (!['Approve', 'Reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = action === 'Approve' ? 'Approved' : 'Rejected';
        await event.save();

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all APPROVED events for listing
// @route   GET /api/events
// @access  Private (Student, Staff, Alumni)
const getApprovedEvents = async (req, res) => {
    try {
        const { title, type, mode } = req.query;

        let query = { status: 'Approved' };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (type && type !== 'All') {
            query.type = type;
        }
        if (mode && mode !== 'All') {
            query.mode = mode;
        }

        const events = await Event.find(query)
            .populate('postedBy', 'name email')
            .sort({ date: 1 }); // Sort by date ascending (nearest first)

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingJobs,
    verifyJob,
    getApprovedJobs,
    getPendingEvents,
    verifyEvent,
    getApprovedEvents
};
