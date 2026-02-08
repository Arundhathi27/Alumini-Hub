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

// @desc    Mark all notifications of a specific type as read
// @route   PUT /api/notifications/mark-type-read
// @access  Private
const markByTypeAsRead = async (req, res) => {
    try {
        const { type } = req.body;

        if (!type) {
            return res.status(400).json({ message: 'Notification type is required' });
        }

        await Notification.updateMany(
            { recipientId: req.user._id, type: type, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: `All ${type} notifications marked as read` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to create notification (Internal use)
const createNotification = async (io, { recipientId, senderId, type, title, message, relatedId }) => {
    try {
        console.log(`[createNotification] Creating notification for user: ${recipientId}, type: ${type}`);
        const notification = await Notification.create({
            recipientId,
            senderId,
            type,
            title,
            message,
            relatedId
        });
        console.log(`[createNotification] Notification saved to DB: ${notification._id}`);

        // Emit socket event if io is provided
        if (io) {
            const roomName = `user:${recipientId}`;
            console.log(`[createNotification] Emitting to room: ${roomName}`);
            io.to(roomName).emit('notification:new', notification);
            console.log(`[createNotification] Emit complete`);
        } else {
            console.log(`[createNotification] WARNING: io is null/undefined, socket emit skipped!`);
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
    markByTypeAsRead,
    createNotification
};
