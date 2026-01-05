const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Webinar', 'Workshop', 'Meetup', 'Alumni Meet'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: String, // Storing as string or Date object. String "YYYY-MM-DD" is easier for basic app.
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            enum: ['Online', 'Offline'],
            required: true,
        },
        location: {
            type: String,
            // Required if mode is Offline, handled in controller/frontend usually, but schema can stay flexible
        },
        link: {
            type: String, // Registration or Meeting link
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

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
