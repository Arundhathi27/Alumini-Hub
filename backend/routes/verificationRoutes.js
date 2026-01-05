const express = require('express');
const router = express.Router();
const { getPendingJobs, verifyJob, getApprovedJobs } = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Listing (Approved Jobs) - Accessible by all roles
// But we still protect it so only logged-in users see it (as per requirement "Students and Staff")
router.get('/', protect, authorize('Student', 'Staff', 'Alumni', 'Admin'), getApprovedJobs);

// Admin/Staff specific
router.get('/pending', protect, authorize('Admin', 'Staff'), getPendingJobs);
router.put('/verify', protect, authorize('Admin', 'Staff'), verifyJob);

module.exports = router;
