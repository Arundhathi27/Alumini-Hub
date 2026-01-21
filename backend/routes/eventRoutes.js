const express = require('express');
const router = express.Router();
const { createEvent, getMyEvents, updateEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Alumni'), createEvent)
    .get(protect, authorize('Alumni'), getMyEvents);

router.route('/:id')
    .put(protect, authorize('Alumni'), updateEvent);

// Note: I destructured it inline to avoid re-requiring the whole object if I didn't import it top-level
// Let's check imports first.

module.exports = router;
