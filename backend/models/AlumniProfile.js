const mongoose = require('mongoose');

const alumniProfileSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true
        },
        phone: {
            type: String,
            default: ''
        },
        about: {
            type: String,
            default: ''
        },
        location: {
            type: String,
            default: ''
        },
        profileImage: {
            type: String, // URL to image/avatar
            default: ''
        },
        // Professional Info
        workExperience: {
            currentCompany: { type: String, default: '' },
            designation: { type: String, default: '' },
            industry: { type: String, default: '' },
            yearsOfExperience: { type: Number, default: 0 }
        },
        skills: [{
            type: String
        }],
        socialLinks: {
            linkedin: { type: String, default: '' },
            github: { type: String, default: '' },
            portfolio: { type: String, default: '' }
        },
        // Metadata
        isCompleted: {
            type: Boolean,
            default: false
        },
        completionPercentage: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Calculate completion percentage before saving
alumniProfileSchema.pre('save', function (next) {
    let filledFields = 0;
    const totalFields = 8; // Adjust based on importance

    if (this.phone) filledFields++;
    if (this.about) filledFields++;
    if (this.location) filledFields++;
    if (this.workExperience.currentCompany) filledFields++;
    if (this.workExperience.designation) filledFields++;
    if (this.skills && this.skills.length > 0) filledFields++;
    if (this.socialLinks.linkedin) filledFields++;

    // Check if linked User has Name/Email (always true if logged in, but conceptually part of profile)
    // We treat user info as base + 1
    filledFields++;

    this.completionPercentage = Math.round((filledFields / totalFields) * 100);
    this.isCompleted = this.completionPercentage === 100;

    next();
});

const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);

module.exports = AlumniProfile;
