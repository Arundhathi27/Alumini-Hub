const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getSummaryStats,
    getUserAnalytics,
    getJobAnalytics,
    getEventAnalytics,
    getChatAnalytics
} = require('../controllers/analyticsController');

// All routes require Admin role
router.get('/summary', protect, authorize('Admin'), getSummaryStats);
router.get('/users', protect, authorize('Admin'), getUserAnalytics);
router.get('/jobs', protect, authorize('Admin'), getJobAnalytics);
router.get('/events', protect, authorize('Admin'), getEventAnalytics);
router.get('/chats', protect, authorize('Admin'), getChatAnalytics);

module.exports = router;
