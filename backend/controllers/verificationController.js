const { createNotification } = require('./notificationController');

// ... imports

// @desc    Get all pending jobs (Admin & Staff) (Restored)
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
        await job.save();

        // NOTIFICATION Trigger
        const io = req.app.get('io');
        await createNotification(io, {
            recipientId: job.postedBy,
            type: 'job_status',
            title: `Job ${action}d`,
            message: `Your job post "${job.title}" has been ${action.toLowerCase()}d.`,
            relatedId: job._id
        });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all APPROVED jobs (Public/Student/Staff/Alumni)
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

        // NOTIFICATION Trigger
        const io = req.app.get('io');
        await createNotification(io, {
            recipientId: event.postedBy,
            type: 'event_status',
            title: `Event ${action}d`,
            message: `Your event "${event.title}" has been ${action.toLowerCase()}d.`,
            relatedId: event._id
        });

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
