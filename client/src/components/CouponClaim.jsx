import { useState } from 'react';
import axios from 'axios';
import React from 'react';

function CouponClaim() {
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [nextAvailable, setNextAvailable] = useState(null);

    // Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL;

    const claimCoupon = async () => {
        setLoading(true);
        setError(null);
        setCoupon(null);
        setSuccess(false);

        try {
            const response = await axios.post(`${apiUrl}/coupons/claim`);
            setCoupon(response.data.coupon);
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to claim coupon');
            if (error.response?.data?.nextAvailable) {
                setNextAvailable(new Date(error.response.data.nextAvailable));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Claim Your Coupon</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                    {nextAvailable && (
                        <p className="mt-2">
                            You can claim again on: {nextAvailable.toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {success && coupon && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Coupon claimed successfully!</p>
                    <div className="mt-3 p-3 bg-gray-100 rounded border border-gray-300">
                        <p className="font-bold text-lg">{coupon.code}</p>
                        <p className="text-gray-700">{coupon.description}</p>
                    </div>
                </div>
            )}

            <button
                onClick={claimCoupon}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            >
                {loading ? 'Claiming...' : 'Claim Coupon'}
            </button>
        </div>
    );
}

export default CouponClaim; 