const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/alumniController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, authorize('Alumni'), getProfile)
    .put(protect, authorize('Alumni'), updateProfile);

module.exports = router;
