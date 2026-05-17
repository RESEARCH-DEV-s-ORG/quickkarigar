const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    images: [String]
}, { timestamps: true });

module.exports = mongoose.model(
    'Review',
    reviewSchema
);