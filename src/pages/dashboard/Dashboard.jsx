import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getUserData, removeUserData } from '../../utils/auth';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const userData = getUserData();

    const handleLogout = () => {
        removeUserData();
        navigate('/login');
    };

    if (!userData) {
        navigate('/login');
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role={userData.role} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar
                    userName={userData.name || 'User'}
                    userRole={userData.role}
                    onLogout={handleLogout}
                />

                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
