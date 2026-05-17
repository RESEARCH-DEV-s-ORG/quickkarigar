const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subject: String,
    description: String,
    status: {
        type: String,
        enum: [
            'open',
            'in_progress',
            'resolved',
            'closed'
        ],
        default: 'open'
    },
    priority: {
        type: String,
        enum: [
            'low',
            'medium',
            'high',
            'critical'
        ],
        default: 'medium'
    }
}, { timestamps: true });

module.exports = mongoose.model(
    'SupportTicket',
    supportTicketSchema
);