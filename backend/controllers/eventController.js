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

// @desc    Update an event (Alumni)
// @route   PUT /api/alumni/events/:id
// @access  Private (Alumni Only)
const updateEvent = async (req, res) => {
    try {
        const {
            title, type, description, date, time, mode, location, link
        } = req.body;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check ownership
        if (event.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check status (Can only edit if 'Pending')
        if (event.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot edit event after it has been processed.' });
        }

        event.title = title || event.title;
        event.type = type || event.type;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.mode = mode || event.mode;
        // Logic for location: if switching to Offline, location is required. If switching to Online, clear location?
        // User logic seems to set location conditionally.
        if (mode === 'Offline' && !location && !event.location) {
            // If mode is offline, new location must be present if old one wasn't there? 
            // Simplest is to just update if provided.
        }
        event.location = mode === 'Offline' ? (location || event.location) : 'Online';
        event.link = link || event.link;

        await event.save();

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getMyEvents,
    updateEvent
};
