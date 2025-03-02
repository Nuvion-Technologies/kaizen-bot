import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyRouteAccess, isAuthenticated, getUserRole } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAccess = async () => {
            setLoading(true);

            // First check if user is authenticated at all
            if (!isAuthenticated()) {
                setLoading(false);
                setHasAccess(false);
                return;
            }

            try {
                // Verify access with the backend
                const access = await verifyRouteAccess(location.pathname);
                setHasAccess(access);

                // If we don't have access, determine the user's role to redirect appropriately
                if (!access) {
                    const role = await getUserRole();
                    setUserRole(role);
                }
            } catch (error) {
                console.error('Error checking route access:', error);
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [location.pathname]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated()) {
        // User is not authenticated, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasAccess) {
        // User is authenticated but doesn't have access to this route
        // Redirect based on their role
        let redirectPath = '/login';

        if (userRole === 'superuser') {
            redirectPath = '/dashboard/super-admin';
        } else if (userRole === 'manager') {
            redirectPath = '/dashboard/manager';
        } else if (userRole === 'user') {
            redirectPath = '/dashboard/user';
        }

        return <Navigate to={redirectPath} replace />;
    }

    // User has access, render the protected component
    return children;
};

export default AuthGuard;
