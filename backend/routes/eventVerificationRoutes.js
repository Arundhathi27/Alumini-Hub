const express = require('express');
const router = express.Router();
const { getPendingEvents, verifyEvent, getApprovedEvents } = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public listing route (all authenticated users)
router.get('/', protect, getApprovedEvents);

// Admin/Staff verification routes
router.get('/pending', protect, authorize('Admin', 'Staff'), getPendingEvents);
router.put('/verify', protect, authorize('Admin', 'Staff'), verifyEvent);

module.exports = router;
