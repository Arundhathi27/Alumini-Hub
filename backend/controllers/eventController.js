const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/alumni/events
// @access  Private (Alumni Only)
const createEvent = async (req, res) => {
    try {
        // Enforce Verification Check
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Only verified alumni can post events.' });
        }

        const {
            title,
            type,
            description,
            date,
            time,
            mode,
            location,
            link
        } = req.body;

        if (!title || !type || !description || !date || !time || !mode) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (mode === 'Offline' && !location) {
            return res.status(400).json({ message: 'Location is required for offline events' });
        }

        const event = await Event.create({
            title,
            type,
            description,
            date,
            time,
            mode,
            location: mode === 'Offline' ? location : 'Online',
            link,
            postedBy: req.user._id,
            status: 'Pending'
        });

        res.status(201).json(event);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events posted by logged-in alumni
// @route   GET /api/alumni/events
// @access  Private (Alumni Only)
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getMyEvents
};
