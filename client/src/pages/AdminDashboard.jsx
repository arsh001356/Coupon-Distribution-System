import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);

// ✅ Include token in all requests
const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true // ✅ Ensure cookies are included
});

// 🔹 Coupon Management Component
function CouponList() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${apiUrl}/coupons`, getAuthHeaders());
            setCoupons(response.data.coupons);
        } catch (error) {
            setError('Failed to fetch coupons');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCouponStatus = async (id, currentStatus) => {
        try {
            await axios.put(`${apiUrl}/coupons/${id}`, { isActive: !currentStatus }, getAuthHeaders());
            fetchCoupons();
        } catch (error) {
            console.error('Error toggling coupon status:', error);
        }
    };

    const deleteCoupon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await axios.delete(`${apiUrl}/coupons/${id}`, getAuthHeaders());
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    if (loading) return <div>Loading coupons...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Coupon Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Code</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Claimed</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="py-2 px-4 border-b">{coupon.code}</td>
                                <td className="py-2 px-4 border-b">{coupon.description}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={coupon.isActive ? 'text-green-600' : 'text-red-600'}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{coupon.isClaimed ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}>
                                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => deleteCoupon(coupon._id)} disabled={coupon.isClaimed}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const location = useLocation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
                <nav>
                    <Link to="/admin/dashboard">Coupon Management</Link>
                </nav>
            </div>

            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <Routes>
                    <Route path="/" element={<CouponList />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard;
