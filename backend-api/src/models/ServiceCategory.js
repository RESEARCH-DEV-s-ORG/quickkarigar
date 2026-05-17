const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    icon: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    baseCommissionPercent: {
        type: Number,
        default: 10
    }
}, { timestamps: true });

module.exports = mongoose.model(
    'ServiceCategory',
    serviceCategorySchema
);