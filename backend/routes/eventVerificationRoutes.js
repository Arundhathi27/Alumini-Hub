const express = require('express');
const router = express.Router();
const { getPendingEvents, verifyEvent } = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Pending Events (Admin & Staff)
router.get('/pending', protect, authorize('Admin', 'Staff'), getPendingEvents);

// Verify Event (Admin & Staff)
router.put('/verify', protect, authorize('Admin', 'Staff'), verifyEvent);

module.exports = router;
