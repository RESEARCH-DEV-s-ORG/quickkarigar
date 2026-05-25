const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: String,
    email: String,
    otp: String,
    purpose: {
        type: String,
        enum: [
            'login',
            'register',
            'reset_password'
        ]
    },
    expiresAt: Date,
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports =
    mongoose.model('OTP', otpSchema);