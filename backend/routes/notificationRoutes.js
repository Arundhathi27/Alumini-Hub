const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    markRelatedNotificationsRead,
    markByTypeAsRead
} = require('../controllers/notificationController');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/related/:id/read', protect, markRelatedNotificationsRead);
router.put('/read-all', protect, markAllAsRead);
router.put('/mark-type-read', protect, markByTypeAsRead);

module.exports = router;
