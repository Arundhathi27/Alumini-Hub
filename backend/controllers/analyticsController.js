const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const ChatRequest = require('../models/ChatRequest');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get summary statistics (KPIs)
// @route   GET /api/admin/analytics/summary
// @access  Admin only
const getSummaryStats = async (req, res) => {
    try {
        const [userStats, jobStats, eventStats, chatStats] = await Promise.all([
            // User Stats
            User.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        byRole: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
                        verified: [{ $match: { role: 'Alumni', isVerified: true } }, { $count: 'count' }],
                        pending: [{ $match: { role: 'Alumni', isVerified: false } }, { $count: 'count' }]
                    }
                }
            ]),
            // Job Stats
            Job.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }]
                    }
                }
            ]),
            // Event Stats
            Event.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
                        upcoming: [{ $match: { date: { $gte: new Date() }, status: 'Approved' } }, { $count: 'count' }]
                    }
                }
            ]),
            // Chat Stats
            Promise.all([
                ChatRequest.countDocuments(),
                Conversation.countDocuments({ approved: true }),
                Message.countDocuments()
            ])
        ]);

        res.json({
            users: {
                total: userStats[0].total[0]?.count || 0,
                byRole: userStats[0].byRole,
                verified: userStats[0].verified[0]?.count || 0,
                pending: userStats[0].pending[0]?.count || 0
            },
            jobs: {
                total: jobStats[0].total[0]?.count || 0,
                byStatus: jobStats[0].byStatus
            },
            events: {
                total: eventStats[0].total[0]?.count || 0,
                byStatus: eventStats[0].byStatus,
                upcoming: eventStats[0].upcoming[0]?.count || 0
            },
            chats: {
                totalRequests: chatStats[0],
                activeConversations: chatStats[1],
                totalMessages: chatStats[2]
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user analytics (growth trends)
// @route   GET /api/admin/analytics/users
// @access  Admin only
const getUserAnalytics = async (req, res) => {
    try {
        // Group users by month of registration
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        // Department breakdown (Alumni only)
        const byDepartment = await User.aggregate([
            { $match: { role: 'Alumni' } },
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            growth: userGrowth,
            byDepartment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get job analytics
// @route   GET /api/admin/analytics/jobs
// @access  Admin only
const getJobAnalytics = async (req, res) => {
    try {
        const [byCompany, byType] = await Promise.all([
            // Top companies by job count
            Job.aggregate([
                { $match: { status: 'Approved' } },
                { $group: { _id: '$company', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            // Jobs by type
            Job.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ])
        ]);

        res.json({
            byCompany,
            byType
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get event analytics
// @route   GET /api/admin/analytics/events
// @access  Admin only
const getEventAnalytics = async (req, res) => {
    try {
        const [byType, byMode] = await Promise.all([
            Event.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]),
            Event.aggregate([
                { $group: { _id: '$mode', count: { $sum: 1 } } }
            ])
        ]);

        res.json({
            byType,
            byMode
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get chat analytics
// @route   GET /api/admin/analytics/chats
// @access  Admin only
const getChatAnalytics = async (req, res) => {
    try {
        const requestsByStatus = await ChatRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const messageGrowth = await Message.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        res.json({
            requestsByStatus,
            messageGrowth
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSummaryStats,
    getUserAnalytics,
    getJobAnalytics,
    getEventAnalytics,
    getChatAnalytics
};
