const express = require('express');
const router = express.Router();
const { createEvent, getMyEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Alumni'), createEvent)
    .get(protect, authorize('Alumni'), getMyEvents);

module.exports = router;
