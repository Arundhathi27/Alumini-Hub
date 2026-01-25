const mongoose = require('mongoose');

const ChatRequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
ChatRequestSchema.index({ requesterId: 1, targetId: 1 });
ChatRequestSchema.index({ targetId: 1, status: 1 });

module.exports = mongoose.model('ChatRequest', ChatRequestSchema);
