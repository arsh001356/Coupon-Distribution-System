const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isClaimed: {
        type: Boolean,
        default: false
    },
    claimedBy: {
        ip: String,
        sessionId: String,
        claimedAt: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema); 