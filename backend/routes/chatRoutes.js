const express = require('express');
const router = express.Router();
const {
    requestChat,
    getPendingRequests,
    respondToRequest,
    getMyConversations,
    getMessages,
    getAdminChats
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student sends chat request
router.post('/request', protect, authorize('Student'), requestChat);

// Get pending requests (Alumni/Staff)
router.get('/requests', protect, authorize('Alumni', 'Staff'), getPendingRequests);

// Respond to request (Alumni/Staff)
router.put('/request/respond', protect, authorize('Alumni', 'Staff'), respondToRequest);

// Get my conversations
router.get('/conversations', protect, getMyConversations);

// Get messages for a conversation
router.get('/messages/:conversationId', protect, getMessages);

// Admin view all chats
router.get('/admin/chats', protect, authorize('Admin'), getAdminChats);

module.exports = router;
