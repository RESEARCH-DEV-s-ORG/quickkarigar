const mongoose = require('mongoose');

const workerDocumentSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    aadhaarNumber: String,
    panNumber: String,
    drivingLicense: String,
    policeVerificationStatus: {
        type: String,
        enum: [
            'pending',
            'verified',
            'rejected'
        ],
        default: 'pending'
    },
    aadhaarFrontUrl: String,
    aadhaarBackUrl: String,
    selfieUrl: String,
    bankAccountHolderName: String,
    bankAccountNumber: String,
    ifscCode: String,
    upiId: String
}, {
    timestamps: true
});
module.exports = mongoose.model(
    'WorkerDocument',
    workerDocumentSchema
);