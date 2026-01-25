const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    chatRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRequest',
        default: null
    },
    approved: {
        type: Boolean,
        default: true
    },
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure exactly 2 participants
ConversationSchema.pre('save', function (next) {
    if (this.participants.length !== 2) {
        return next(new Error('Conversation must have exactly 2 participants'));
    }
    next();
});

// Index for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
