const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String
    },
    role: {
        type: String,
        enum: [
            'customer',
            'worker',
            'admin',
            'super_admin'
        ],
        default: 'customer'
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isKYCVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: Date,
    status: {
        type: String,
        enum: [
            'active',
            'blocked',
            'suspended',
            'deleted'
        ],
        default: 'active'
    },
    lastLoginAt: Date,
    deviceTokens: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model(
    'User',
    userSchema
);