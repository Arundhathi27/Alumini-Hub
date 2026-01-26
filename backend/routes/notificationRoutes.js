const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    markRelatedNotificationsRead
} = require('../controllers/notificationController');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/related/:id/read', protect, markRelatedNotificationsRead);
router.put('/read-all', protect, markAllAsRead);

module.exports = router;
