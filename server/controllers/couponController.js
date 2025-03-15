const Coupon = require('../models/Coupon');
const ClaimLog = require('../models/ClaimLog');

// Get next available coupon (round-robin)
exports.claimCoupon = async (req, res) => {
    const ip = req.ip;
    const sessionId = req.cookies.sessionId;

    try {
        // Find the next available coupon
        const coupon = await Coupon.findOne({
            isActive: true,
            isClaimed: false
        }).sort({ createdAt: 1 });

        if (!coupon) {
            return res.status(404).json({ message: 'No coupons available at this time' });
        }

        // Mark coupon as claimed
        coupon.isClaimed = true;
        coupon.claimedBy = {
            ip,
            sessionId,
            claimedAt: new Date()
        };
        await coupon.save();

        // Log the claim
        await ClaimLog.create({
            ip,
            sessionId,
            couponId: coupon._id
        });

        res.status(200).json({
            message: 'Coupon claimed successfully',
            coupon: {
                code: coupon.code,
                description: coupon.description
            }
        });
    } catch (error) {
        console.error('Claim coupon error:', error);
        res.status(500).json({ message: 'Server error claiming coupon' });
    }
};

// Admin: Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ coupons });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ message: 'Server error fetching coupons' });
    }
};

// Admin: Add new coupon
exports.addCoupon = async (req, res) => {
    const { code, description, isActive } = req.body;

    try {
        const newCoupon = await Coupon.create({
            code,
            description,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            message: 'Coupon added successfully',
            coupon: newCoupon
        });
    } catch (error) {
        console.error('Add coupon error:', error);

        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        res.status(500).json({ message: 'Server error adding coupon' });
    }
};

// Admin: Update coupon
exports.updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { code, description, isActive } = req.body;

    try {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        if (code) coupon.code = code;
        if (description) coupon.description = description;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();

        res.status(200).json({
            message: 'Coupon updated successfully',
            coupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        res.status(500).json({ message: 'Server error updating coupon' });
    }
};

// Admin: Delete coupon
exports.deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ message: 'Server error deleting coupon' });
    }
};

// Admin: Get claim history
exports.getClaimHistory = async (req, res) => {
    try {
        const claims = await ClaimLog.find()
            .populate('couponId')
            .sort({ createdAt: -1 });

        res.status(200).json({ claims });
    } catch (error) {
        console.error('Get claim history error:', error);
        res.status(500).json({ message: 'Server error fetching claim history' });
    }
}; 