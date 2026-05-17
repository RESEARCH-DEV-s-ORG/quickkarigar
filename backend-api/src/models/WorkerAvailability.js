const mongoose = require('mongoose');

const workerAvailabilitySchema =
    new mongoose.Schema({
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        },
        availableDays: [String],
        startTime: String,
        endTime: String,
        isOnline: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true });
module.exports = mongoose.model(
    'WorkerAvailability',
    workerAvailabilitySchema
);