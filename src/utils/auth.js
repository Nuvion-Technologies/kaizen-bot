import api from './api';

// Store token in localStorage
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

// Store role in localStorage
export const setUserRole = (role) => {
    if (role) {
        localStorage.setItem('userRole', role);
    } else {
        localStorage.removeItem('userRole');
    }
};

// Get the token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Get the role from localStorage
export const getUserRole = () => {
    return localStorage.getItem('userRole');
};

// Check if user is authenticated (has a token)
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Clear all auth data
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Redirect to login page
    window.location.href = '/login';
};

// Get user data from localStorage
export const getUserData = () => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token) return null;

    return {
        token,
        role
    };
};

// Set user data in localStorage
export const setUserData = (data) => {
    if (data.token) {
        setAuthToken(data.token);
    }

    if (data.role) {
        setUserRole(data.role);
    }
};

// Verify if user has access to a specific route
export const verifyRouteAccess = (route) => {
    const role = getUserRole();

    if (!role) return false;

    // Map routes to allowed roles
    const routeRoleMap = {
        '/dashboard/super-admin': ['superuser'],
        '/dashboard/manager': ['superuser', 'manager'],
        '/dashboard/user': ['superuser', 'manager', 'user'],
        '/portfolio': ['superuser', 'manager', 'user'],
        '/orders': ['superuser', 'manager', 'user'],
        '/profile': ['superuser', 'manager', 'user'],
        '/analytics': ['superuser', 'manager']
    };

    const allowedRoles = routeRoleMap[route] || [];
    return allowedRoles.includes(role);
};
