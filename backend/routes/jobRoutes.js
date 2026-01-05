const express = require('express');
const router = express.Router();
const { createJob, getMyJobs, getAllJobs, updateJobStatus } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Alumni'), createJob)
    .get(protect, authorize('Alumni'), getMyJobs);

// Admin Routes
router.get('/all', protect, authorize('Admin'), getAllJobs);
router.put('/:id/status', protect, authorize('Admin'), updateJobStatus);

module.exports = router;
