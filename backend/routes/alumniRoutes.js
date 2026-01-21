const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getVerifiedAlumni } = require('../controllers/alumniController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public directory route (authenticated users)
router.get('/', protect, authorize('Admin', 'Staff', 'Student'), getVerifiedAlumni);

// Alumni profile management routes
router.route('/profile')
    .get(protect, authorize('Alumni'), getProfile)
    .put(protect, authorize('Alumni'), updateProfile);

module.exports = router;
