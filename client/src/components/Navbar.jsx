import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

function Navbar() {
    const { admin, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Coupon System</Link>
                <div>
                    {admin ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/admin/login" className="hover:text-gray-300">Admin Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 