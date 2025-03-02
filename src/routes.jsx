import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import AuthGuard from './components/AuthGuard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';

// Common Pages
import Portfolio from './pages/common/Portfolio';
import Orders from './pages/common/Orders';
import Profile from './pages/common/Profile';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes - Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboard Routes - Protected with backend verification */}
            <Route
                path="/dashboard/super-admin"
                element={
                    <AuthGuard>
                        <SuperAdminDashboard />
                    </AuthGuard>
                }
            />

            <Route
                path="/dashboard/manager"
                element={
                    <AuthGuard>
                        <ManagerDashboard />
                    </AuthGuard>
                }
            />

            <Route
                path="/dashboard/user"
                element={
                    <AuthGuard>
                        <UserDashboard />
                    </AuthGuard>
                }
            />

            {/* Common Routes - Protected */}
            <Route
                path="/portfolio"
                element={
                    <AuthGuard>
                        <Portfolio />
                    </AuthGuard>
                }
            />

            <Route
                path="/orders"
                element={
                    <AuthGuard>
                        <Orders />
                    </AuthGuard>
                }
            />

            <Route
                path="/profile"
                element={
                    <AuthGuard>
                        <Profile />
                    </AuthGuard>
                }
            />

            {/* Root Route - Redirect based on authentication status */}
            <Route
                path="/"
                element={
                    isAuthenticated() ? (
                        <Navigate to={`/dashboard/${getUserRole() || "user"}`} replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />



            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
