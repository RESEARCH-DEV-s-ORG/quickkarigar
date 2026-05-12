const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g., 'Plumber', 'Tutor'
    experience: { type: Number, default: 0 },
    bio: { type: String },
    basePrice: { type: Number },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: [{
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        stars: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Worker', workerSchema);