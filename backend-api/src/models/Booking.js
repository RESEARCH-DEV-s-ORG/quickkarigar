const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceCategory: String,
    serviceTitle: String,
    description: String,
    address: {
        fullAddress: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: [Number]
    },
    scheduledDate: Date,
    scheduledTimeSlot: String,
    estimatedAmount: Number,
    finalAmount: Number,
    platformFee: Number,
    workerEarning: Number,
    status: {
        type: String,
        enum: [
            'pending',
            'accepted',
            'worker_arriving',
            'in_progress',
            'completed',
            'cancelled',
            'refunded',
            'disputed'
        ],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'paid',
            'failed',
            'refunded'
        ],
        default: 'pending'
    },
    cancellationReason: String,
    completedAt: Date
}, {
    timestamps: true
});
module.exports = mongoose.model(
    'Booking',
    bookingSchema
);