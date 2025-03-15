import CouponClaim from '../components/CouponClaim';
import React from 'react';
function HomePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Welcome to the Coupon Distribution System</h1>
                <p className="text-gray-600">
                    Claim your exclusive coupon below. Each user can claim one coupon every 24 hours.
                </p>
            </div>

            <CouponClaim />

            <div className="mt-10 bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">How It Works</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Click the "Claim Coupon" button to get your unique coupon code</li>
                    <li>Each user can claim one coupon every 24 hours</li>
                    <li>Coupons are distributed in a round-robin fashion</li>
                    <li>Your coupon will be displayed immediately after claiming</li>
                </ul>
            </div>
        </div>
    );
}

export default HomePage; 