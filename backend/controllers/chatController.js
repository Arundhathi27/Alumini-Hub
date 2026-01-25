const ChatRequest = require('../models/ChatRequest');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Student requests chat with Alumni/Staff
// @route   POST /api/chat/request
// @access  Private (Student only)
const requestChat = async (req, res) => {
    try {
        const { targetId } = req.body;
        const requesterId = req.user._id;

        console.log('Chat request received:', { requesterId, targetId });

        // Validate targetId
        if (!targetId) {
            return res.status(400).json({ message: 'Target user ID is required' });
        }

        // Cannot request self
        if (requesterId.toString() === targetId.toString()) {
            return res.status(400).json({ message: 'Cannot request chat with yourself' });
        }

        // Get requester and target
        const requester = await User.findById(requesterId);
        const target = await User.findById(targetId);

        console.log('Requester:', { id: requester._id, role: requester.role });
        console.log('Target:', target ? { id: target._id, role: target.role } : 'Not found');

        if (!target) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Role validation - Student can only chat with Alumni or Staff
        if (requester.role === 'Student') {
            if (target.role === 'Student') {
                return res.status(400).json({ message: 'Students cannot chat with other students' });
            }
            if (target.role === 'Admin') {
                return res.status(400).json({ message: 'Cannot chat with admin' });
            }
        }

        // Alumni/Staff can chat with Students or each other (but not same role)
        if ((requester.role === 'Alumni' || requester.role === 'Staff') &&
            requester.role === target.role) {
            return res.status(400).json({ message: `Cannot chat with another ${requester.role}` });
        }

        // Check for existing request
        const existingRequest = await ChatRequest.findOne({
            requesterId,
            targetId,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'Chat request already exists',
                status: existingRequest.status
            });
        }

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [requesterId, targetId] }
        });

        if (existingConversation) {
            return res.status(400).json({ message: 'Conversation already exists' });
        }

        // Create request
        const chatRequest = await ChatRequest.create({
            requesterId,
            targetId,
            status: 'Pending'
        });

        console.log('Chat request created:', chatRequest);

        res.status(201).json(chatRequest);
    } catch (error) {
        console.error('Error in requestChat:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get pending chat requests for Alumni/Staff
// @route   GET /api/chat/requests
// @access  Private (Alumni, Staff)
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
// @route   PUT /api/chat/request/respond
// @access  Private (Alumni, Staff)
const respondToRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'approve' | 'reject'
        const userId = req.user._id;

        const chatRequest = await ChatRequest.findById(requestId);

        if (!chatRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify this request is for current user
        if (chatRequest.targetId.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (chatRequest.status !== 'Pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        if (action === 'approve') {
            chatRequest.status = 'Approved';
            await chatRequest.save();

            // Create conversation
            const conversation = await Conversation.create({
                participants: [chatRequest.requesterId, chatRequest.targetId],
                chatRequestId: chatRequest._id,
                approved: true
            });

            res.json({ message: 'Request approved', conversation });
        } else if (action === 'reject') {
            chatRequest.status = 'Rejected';
            await chatRequest.save();

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
