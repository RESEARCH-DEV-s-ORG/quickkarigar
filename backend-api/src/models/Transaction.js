const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
        ref: 'User'
    },
    amount: Number,
    platformCommission: Number,
    workerAmount: Number,
    paymentMethod: {
        type: String,
        enum: [
            'upi',
            'card',
            'netbanking',
            'wallet',
            'cash'
        ]
    },
    paymentGateway: String,
    transactionId: String,
    gatewayResponse: Object,
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'success',
            'failed',
            'refunded'
        ]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model(
    'Transaction',
    transactionSchema
);