const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const jwt = require('jsonwebtoken');

// JWT authentication middleware for Socket.io
const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
};

const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join user to their own room for notifications
        socket.join(`user:${socket.userId}`);

        // Join a conversation room
        socket.on('joinConversation', async (conversationId) => {
            try {
                // Verify user is participant
                const conversation = await Conversation.findById(conversationId);

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                const isParticipant = conversation.participants.some(
                    p => p.toString() === socket.userId.toString()
                );

                // Admin can join any conversation (read-only)
                if (!isParticipant && socket.userRole !== 'Admin') {
                    socket.emit('error', { message: 'Not authorized' });
                    return;
                }

                socket.join(`conversation:${conversationId}`);
                socket.currentConversation = conversationId;

                console.log(`User ${socket.userId} joined conversation ${conversationId}`);
            } catch (error) {
                console.error('Join conversation error:', error);
                socket.emit('error', { message: 'Failed to join conversation' });
            }
        });

        // Send a message
        socket.on('sendMessage', async (data) => {
            try {
                const { conversationId, messageText } = data;

                // Verify user is participant
                const conversation = await Conversation.findById(conversationId);

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                const isParticipant = conversation.participants.some(
                    p => p.toString() === socket.userId.toString()
                );

                if (!isParticipant) {
                    socket.emit('error', { message: 'Not authorized' });
                    return;
                }

                // Admin cannot send messages
                if (socket.userRole === 'Admin') {
                    socket.emit('error', { message: 'Admin cannot send messages' });
                    return;
                }

                // Create message
                const message = await Message.create({
                    conversationId,
                    senderId: socket.userId,
                    messageText,
                    isRead: false
                });

                // Populate sender info
                await message.populate('senderId', 'name role');

                // Update conversation last message
                conversation.lastMessage = messageText.substring(0, 50);
                conversation.lastMessageAt = new Date();
                await conversation.save();

                // Broadcast to all users in conversation
                io.to(`conversation:${conversationId}`).emit('receiveMessage', {
                    _id: message._id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    messageText: message.messageText,
                    isRead: message.isRead,
                    createdAt: message.createdAt
                });

                console.log(`Message sent in conversation ${conversationId}`);
            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Mark message as read
        socket.on('messageRead', async (messageId) => {
            try {
                const message = await Message.findById(messageId);

                if (!message) {
                    return;
                }

                // Only recipient can mark as read
                if (message.senderId.toString() === socket.userId.toString()) {
                    return; // Sender cannot mark own message as read
                }

                message.isRead = true;
                await message.save();

                // Notify sender
                io.to(`conversation:${message.conversationId}`).emit('messageReadStatus', {
                    messageId: message._id,
                    isRead: true
                });
            } catch (error) {
                console.error('Mark read error:', error);
            }
        });

        // Leave conversation
        socket.on('leaveConversation', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            socket.currentConversation = null;
            console.log(`User ${socket.userId} left conversation ${conversationId}`);
        });

        // Typing indicator
        socket.on('typing', (conversationId) => {
            socket.to(`conversation:${conversationId}`).emit('userTyping', {
                userId: socket.userId,
                conversationId
            });
        });

        socket.on('stopTyping', (conversationId) => {
            socket.to(`conversation:${conversationId}`).emit('userStoppedTyping', {
                userId: socket.userId,
                conversationId
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
};

module.exports = { socketAuthMiddleware, setupSocketHandlers };
