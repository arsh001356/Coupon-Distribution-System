const mongoose = require('mongoose');

const claimLogSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ClaimLog', claimLogSchema); 