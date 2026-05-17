const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    amount: Number,
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'paid',
            'failed'
        ],
        default: 'pending'
    },
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
    processedAt: Date
}, { timestamps: true });

module.exports = mongoose.model(
    'Payout',
    payoutSchema
);