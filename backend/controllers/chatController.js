const { createNotification } = require('./notificationController');

const ChatRequest = require('../models/ChatRequest');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Student requests chat with Alumni/Staff
const requestChat = async (req, res) => {
    try {
        const { targetId } = req.body;
        const requesterId = req.user._id;

        // ... existing validation ...

        // Create request
        const chatRequest = await ChatRequest.create({
            requesterId,
            targetId,
            status: 'Pending'
        });

        console.log('Chat request created:', chatRequest);

        // NOTIFICATION Trigger
        const io = req.app.get('io');
        await createNotification(io, {
            recipientId: targetId,
            senderId: requesterId,
            type: 'chat_request',
            title: 'New Chat Request',
            message: `${req.user.name} has requested to chat with you.`,
            relatedId: chatRequest._id
        });

        res.status(201).json(chatRequest);
    } catch (error) {
        console.error('Error in requestChat:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get pending chat requests for Alumni/Staff
const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await ChatRequest.find({
            targetId: userId,
            status: 'Pending'
        })
            .populate('requesterId', 'name email role batchYear department')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Respond to chat request (Approve/Reject)
const respondToRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'approve' | 'reject'
        const userId = req.user._id;

        const chatRequest = await ChatRequest.findById(requestId)
            .populate('requesterId', 'name'); // Populate to get name for notification

        // ... validation ...

        const io = req.app.get('io');

        if (action === 'approve') {
            chatRequest.status = 'Approved';
            await chatRequest.save();

            // Create conversation
            const conversation = await Conversation.create({
                participants: [chatRequest.requesterId._id, chatRequest.targetId],
                chatRequestId: chatRequest._id,
                approved: true
            });

            // NOTIFICATION Trigger (Approved)
            await createNotification(io, {
                recipientId: chatRequest.requesterId._id,
                senderId: userId,
                type: 'chat_response',
                title: 'Chat Request Approved',
                message: `${req.user.name} approved your chat request.`,
                relatedId: conversation._id
            });

            res.json({ message: 'Request approved', conversation });
        } else if (action === 'reject') {
            chatRequest.status = 'Rejected';
            await chatRequest.save();

            // NOTIFICATION Trigger (Rejected)
            await createNotification(io, {
                recipientId: chatRequest.requesterId._id,
                senderId: userId,
                type: 'chat_response',
                title: 'Chat Request Rejected',
                message: `${req.user.name} declined your chat request.`,
                relatedId: chatRequest._id
            });

            res.json({ message: 'Request rejected' });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my conversations
// @route   GET /api/chat/conversations
// @access  Private (All authenticated users except Admin)
const getMyConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
            approved: true
        })
            .populate('participants', 'name email role batchYear department')
            .sort({ lastMessageAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const isParticipant = conversation.participants.some(
            p => p.toString() === userId.toString()
        );

        if (!isParticipant && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const messages = await Message.find({ conversationId })
            .populate('senderId', 'name')
            .sort({ createdAt: 1 })
            .limit(100); // Last 100 messages

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin view all chats
// @route   GET /api/admin/chats
// @access  Private (Admin only)
const getAdminChats = async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .populate('participants', 'name email role')
            .sort({ lastMessageAt: -1 })
            .limit(50);

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    requestChat,
    getPendingRequests,
    respondToRequest,
    getMyConversations,
    getMessages,
    getAdminChats
};
