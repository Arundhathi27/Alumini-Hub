const Notification = require('../models/Notification');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50

        // Count unread
        const unreadCount = await Notification.countDocuments({
            recipientId: req.user._id,
            isRead: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check ownership
        if (notification.recipientId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notifications as read by related entity ID (e.g. Conversation ID)
// @route   PUT /api/notifications/related/:id/read
// @access  Private
const markRelatedNotificationsRead = async (req, res) => {
    try {
        const { id: relatedId } = req.params;

        await Notification.updateMany(
            {
                recipientId: req.user._id,
                relatedId: relatedId,
                isRead: false
            },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Related notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to create notification (Internal use)
const createNotification = async (io, { recipientId, senderId, type, title, message, relatedId }) => {
    try {
        const notification = await Notification.create({
            recipientId,
            senderId,
            type,
            title,
            message,
            relatedId
        });

        // Emit socket event if io is provided
        if (io) {
            // Find socket(s) for this user
            // Assuming room pattern: `user:${userId}` as seen in socketHandler.js
            io.to(`user:${recipientId}`).emit('notification:new', notification);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    markRelatedNotificationsRead,
    createNotification
};
