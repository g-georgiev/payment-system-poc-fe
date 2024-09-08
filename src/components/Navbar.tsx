import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Payment Provider POC</Link>
                <div className="space-x-4">
                   <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;