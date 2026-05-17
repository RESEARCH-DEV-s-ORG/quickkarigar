const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceCategory: {
        type: String,
        required: true
    },
    experienceYears: Number,
    skills: [String],
    bio: String,
    languages: [String],
    hourlyRate: Number,
    isAvailable: {
        type: Boolean,
        default: true
    },
    ratingAverage: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalJobsCompleted: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    currentLocation: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    serviceRadiusKm: {
        type: Number,
        default: 10
    },
    onlineStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    'WorkerProfile',
    workerProfileSchema
);