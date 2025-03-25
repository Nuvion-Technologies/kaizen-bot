import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole, verifyRouteAccess } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children, allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Short timeout to ensure state updates properly
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get user role
    const userRole = getUserRole();

    // Check if user has access to this route
    const hasAccess = verifyRouteAccess(location.pathname);

    if (!hasAccess) {
        console.log(`User with role ${userRole} does not have access to ${location.pathname}`);

        // Redirect to appropriate dashboard based on user's role
        let redirectPath = '/login';

        if (userRole === 'superuser') {
            redirectPath = '/dashboard/super-admin';
        } else if (userRole === 'manager') {
            redirectPath = '/dashboard/manager';
        } else if (userRole === 'user') {
            redirectPath = '/dashboard/user';
        }

        // Only redirect if we're not already on the target path
        if (location.pathname !== redirectPath) {
            return <Navigate to={redirectPath} replace />;
        }
    }

    // User is authenticated and has access
    return children;
};

export default AuthGuard;
