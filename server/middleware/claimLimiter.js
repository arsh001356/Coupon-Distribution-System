const ClaimLog = require('../models/ClaimLog');

// Middleware to prevent abuse by checking IP and session
const claimLimiter = async (req, res, next) => {
    const ip = req.ip;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
    }

    try {
        // Check if this IP or session has claimed within cooldown period (24 hours)
        const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const recentClaim = await ClaimLog.findOne({
            $or: [{ ip }, { sessionId }],
            createdAt: { $gt: new Date(Date.now() - cooldownPeriod) }
        });

        if (recentClaim) {
            const timeLeft = new Date(recentClaim.createdAt.getTime() + cooldownPeriod) - new Date();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            return res.status(429).json({
                message: `You can claim another coupon in ${hoursLeft} hours and ${minutesLeft} minutes`,
                nextAvailable: new Date(recentClaim.createdAt.getTime() + cooldownPeriod)
            });
        }

        next();
    } catch (error) {
        console.error('Claim limiter error:', error);
        res.status(500).json({ message: 'Server error checking claim eligibility' });
    }
};

module.exports = claimLimiter; 