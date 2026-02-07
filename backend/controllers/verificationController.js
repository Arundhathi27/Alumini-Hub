const { createNotification } = require('./notificationController');
const sendEmail = require('../utils/emailService');

const Job = require('../models/Job');
const Event = require('../models/Event');
const User = require('../models/User');

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

        // NOTIFICATION Trigger (Alumni)
        const io = req.app.get('io');
        await createNotification(io, {
            recipientId: job.postedBy._id || job.postedBy, // Ensure ID availability
            type: 'job_status',
            title: `Job ${action}d`,
            message: `Your job post "${job.title}" has been ${action.toLowerCase()}d.`,
            relatedId: job._id
        });

        // NOTIFICATION Trigger (Students - Only on Approve)
        if (action === 'Approve') {
            const students = await User.find({ role: 'Student' });
            console.log(`Notifying ${students.length} students about new job: ${job.title}`);
            for (const student of students) {
                await createNotification(io, {
                    recipientId: student._id,
                    type: 'job_alert',
                    title: 'New Job Opportunity',
                    message: `A new job "${job.title}" at ${job.company} has been posted.`,
                    relatedId: job._id
                });
            }
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all APPROVED jobs (Public/Student/Staff/Alumni)
const getApprovedJobs = async (req, res) => {
    try {
        const { title, company, location, type, role } = req.query;

        console.log('Fetching Approved Jobs with query params:', req.query);

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

        // NOTIFICATION Trigger (Alumni)
        const io = req.app.get('io');
        await createNotification(io, {
            recipientId: event.postedBy,
            type: 'event_status',
            title: `Event ${action}d`,
            message: `Your event "${event.title}" has been ${action.toLowerCase()}d.`,
            relatedId: event._id
        });

        // NOTIFICATION Trigger (Students - Only on Approve)
        if (action === 'Approve') {
            const students = await User.find({ role: 'Student' });
            console.log(`Notifying ${students.length} students about new event: ${event.title}`);

            // Send Email to All Students
            const emailSubject = 'New Event Alert!';
            const emailHtml = `
                <h2>New Event: ${event.title}</h2>
                <p>A new event has been scheduled. Check it out!</p>
                <ul>
                    <li><strong>Title:</strong> ${event.title}</li>
                    <li><strong>Type:</strong> ${event.type}</li>
                    <li><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</li>
                    <li><strong>Time:</strong> ${event.time}</li>
                    <li><strong>Mode:</strong> ${event.mode}</li>
                </ul>
                <p>Log in to the portal for more details.</p>
                <p><a href="http://localhost:5173/login">Go to Login</a></p>
            `;

            for (const student of students) {
                // Send In-App Notification
                await createNotification(io, {
                    recipientId: student._id,
                    type: 'event_alert',
                    title: 'New Event',
                    message: `A new event "${event.title}" has been scheduled. Check it out!`,
                    relatedId: event._id
                });

                // Send Email
                await sendEmail({ to: student.email, subject: emailSubject, html: emailHtml });
            }
        }

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
