const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const claimLimiter = require('../middleware/claimLimiter');

// Public routes
router.post('/claim', claimLimiter, couponController.claimCoupon);

// Admin routes
router.get('/', authMiddleware, couponController.getAllCoupons);
router.post('/', authMiddleware, couponController.addCoupon);
router.put('/:id', authMiddleware, couponController.updateCoupon);
router.delete('/:id', authMiddleware, couponController.deleteCoupon);
router.get('/claims', authMiddleware, couponController.getClaimHistory);

module.exports = router; 