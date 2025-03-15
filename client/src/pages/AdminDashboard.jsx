import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

// At the top of the file, add:
const apiUrl = import.meta.env.VITE_API_URL;

console.log('API URL:', import.meta.env.VITE_API_URL);

// Dashboard components
function CouponList() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${apiUrl}/coupons`);
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
            await axios.put(`${apiUrl}/coupons/${id}`, {
                isActive: !currentStatus
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error toggling coupon status:', error);
        }
    };

    const deleteCoupon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) {
            return;
        }

        try {
            await axios.delete(`${apiUrl}/coupons/${id}`);
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
                            <th className="py-2 px-4 border-b text-left">Code</th>
                            <th className="py-2 px-4 border-b text-left">Description</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-left">Claimed</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 px-4 text-center">No coupons available</td>
                            </tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{coupon.code}</td>
                                    <td className="py-2 px-4 border-b">{coupon.description}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs ${coupon.isClaimed ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {coupon.isClaimed ? 'Claimed' : 'Available'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                                                className={`px-2 py-1 rounded text-xs ${coupon.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                                            >
                                                {coupon.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => deleteCoupon(coupon._id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                                disabled={coupon.isClaimed}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AddCoupon() {
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(`${apiUrl}/coupons`, {
                code,
                description,
                isActive
            });

            setSuccess('Coupon added successfully');
            setCode('');
            setDescription('');
            setIsActive(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                        Coupon Code
                    </label>
                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="mr-2"
                        />
                        <span className="text-gray-700">Active</span>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
                    >
                        {loading ? 'Adding...' : 'Add Coupon'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ClaimHistory() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await axios.get(`${apiUrl}/coupons/claims`);
                setClaims(response.data.claims);
            } catch (error) {
                setError('Failed to fetch claim history');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, []);

    if (loading) return <div>Loading claim history...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Claim History</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">IP Address</th>
                            <th className="py-2 px-4 border-b text-left">Session ID</th>
                            <th className="py-2 px-4 border-b text-left">Coupon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-4 px-4 text-center">No claim history available</td>
                            </tr>
                        ) : (
                            claims.map((claim) => (
                                <tr key={claim._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        {new Date(claim.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border-b">{claim.ip}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className="text-xs">{claim.sessionId.substring(0, 8)}...</span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {claim.couponId ? claim.couponId.code : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
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
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Admin Dashboard</h2>
                <nav className="flex flex-col space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className={`p-2 rounded ${location.pathname === '/admin/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Coupon Management
                    </Link>
                    <Link
                        to="/admin/dashboard/add"
                        className={`p-2 rounded ${location.pathname === '/admin/dashboard/add' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Add New Coupon
                    </Link>
                    <Link
                        to="/admin/dashboard/history"
                        className={`p-2 rounded ${location.pathname === '/admin/dashboard/history' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Claim History
                    </Link>
                </nav>
            </div>

            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <Routes>
                    <Route path="/" element={<CouponList />} />
                    <Route path="/add" element={<AddCoupon />} />
                    <Route path="/history" element={<ClaimHistory />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard; 