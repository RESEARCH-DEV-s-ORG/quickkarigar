const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageType: {
        type: String,
        enum: [
            'text',
            'image',
            'voice',
            'system'
        ],
        default: 'text'
    },
    text: String,
    mediaUrl: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
module.exports = mongoose.model(
    'Message',
    messageSchema
);