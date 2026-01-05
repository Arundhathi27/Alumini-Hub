const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        experience: {
            type: String, // e.g. "0-2 years"
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        applyLink: {
            type: String,
            required: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
