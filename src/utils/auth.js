// import api from './api';
//
// // Store only the token in localStorage, not the role
// export const setAuthToken = (token) => {
//     if (token) {
//         localStorage.setItem('token', token);
//     } else {
//         localStorage.removeItem('token');
//     }
// };
//
// // Get the token from localStorage
// export const getAuthToken = () => {
//     return localStorage.getItem('token');
// };
//
// // Check if user is authenticated (has a token)
// export const isAuthenticated = () => {
//     return !!getAuthToken();
// };
//
// // Clear all auth data
// export const logout = () => {
//     localStorage.removeItem('token');
//     // Redirect to login page
//     window.location.href = '/login';
// };
//
// // Verify access to a specific route with the backend
// export const verifyRouteAccess = async (route) => {
//     try {
//         console.log("trying to verify route access");
//
//         // Map frontend routes to backend endpoints
//         const routeMap = {
//             '/dashboard/super-admin': '/superuser',
//             '/dashboard/manager': '/manager',
//             '/dashboard/user': '/user'
//         };
//
//         console.log(routeMap);
//
//         const endpoint = routeMap[route];
//         if (!endpoint) {
//             return false; // Route not in our map
//         }
//
//         const response = await api.get(endpoint);
//         console.log("endpoint",endpoint);
//         console.log("statusdfghjkl;",response.decryptedData.status);
//
//         // Check if we have decrypted data and its status is 200
//         if (response.decryptedData && response.decryptedData.status === "200") {
//
//             return true;
//         }
//
//         // If we get a successful response but no decrypted data, still consider it a success
//         // return response.decryptedData.status === 200;
//
//     } catch (error) {
//         console.error('Route access verification failed:', error);
//
//         // If we get a 401 or 403, the user doesn't have access
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             return false;
//         }
//
//         // For other errors (like network issues), we'll default to denying access
//         return false;
//     }
// };
//
// // Get the user's role by checking which endpoints they can access
// export const getUserRole = async () => {
//     try {
//         // Try superuser first
//         try {
//             console.log("getUserRole superuser");
//
//             const superuserResponse = await api.get('/superuser');
//             console.log("superuserResponse", superuserResponse);
//             console.log("superuserResponse", superuserResponse);
//
//             // Check decrypted data status
//             if (superuserResponse.decryptedData && superuserResponse.decryptedData.status === "200") {
//                 return 'superuser';
//             }
//         } catch (error) {
//             // Not a superuser, continue checking
//         }
//
//         // Try manager next
//         try {
//             const managerResponse = await api.get('/manager');
//
//             // Check decrypted data status
//             if (managerResponse.decryptedData && managerResponse.decryptedData.status === "200") {
//                 return 'manager';
//             }
//         } catch (error) {
//             // Not a manager, continue checking
//         }
//
//         // Try user last
//         try {
//             const userResponse = await api.get('/user');
//
//             // Check decrypted data status
//             if (userResponse.decryptedData && userResponse.decryptedData.status === "200") {
//                 return 'user';
//             }
//         } catch (error) {
//             // Not a user either
//         }
//
//         // If we get here, we couldn't determine the role
//         return null;
//     } catch (error) {
//         console.error('Error determining user role:', error);
//         return null;
//     }
// };




// import api from './api';
//
// // Store only the token in localStorage, not the role
// export const setAuthToken = (token) => {
//     if (token) {
//         localStorage.setItem('token', token);
//     } else {
//         localStorage.removeItem('token');
//     }
// };
//
// // Get the token from localStorage
// export const getAuthToken = () => {
//     return localStorage.getItem('token');
// };
//
// // Check if user is authenticated (has a token)
// export const isAuthenticated = () => {
//     return !!getAuthToken();
// };
//
// // Clear all auth data
// export const logout = () => {
//     localStorage.removeItem('token');
//     // Redirect to login page
//     window.location.href = '/login';
// };
//
// // Verify access to a specific route with the backend
// export const verifyRouteAccess = async (route) => {
//     try {
//         console.log("trying to verify route access");
//
//         // Map frontend routes to backend endpoints
//         const routeMap = {
//             '/dashboard/super-admin': '/superuser',
//             '/dashboard/manager': '/manager',
//             '/dashboard/user': '/user'
//         };
//
//         console.log(routeMap);
//
//         const endpoint = routeMap[route];
//         if (!endpoint) {
//             return false; // Route not in our map
//         }
//
//         const response = await api.get(endpoint);
//         console.log("endpoint",endpoint);
//         console.log("statusdfghjkl;",response.decryptedData.status);
//
//         // Check if we have decrypted data and its status is 200
//         if (response.decryptedData && response.decryptedData.status === "200") {
//             return true;
//         }
//
//         // If we get a successful response but no decrypted data, still consider it a success
//         // return response.decryptedData.status === 200;
//
//     } catch (error) {
//         console.error('Route access verification failed:', error);
//
//         // If we get a 401 or 403, the user doesn't have access
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             return false;
//         }
//
//         // For other errors (like network issues), we'll default to denying access
//         return false;
//     }
// };
//
// // Cache for storing the user role to prevent repeated API calls
// let cachedUserRole = null;
// let roleCheckInProgress = false;
//
// // Get the user's role by checking which endpoints they can access
// export const getUserRole = async () => {
//     // If we already have a cached role, return it
//     if (cachedUserRole) {
//         return cachedUserRole;
//     }
//
//     // If a role check is already in progress, return null to prevent multiple simultaneous calls
//     if (roleCheckInProgress) {
//         return null;
//     }
//
//     try {
//         roleCheckInProgress = true;
//
//         // Try superuser first
//         try {
//             console.log("getUserRole superuser");
//
//             const superuserResponse = await api.get('/superuser');
//             console.log("superuserResponse", superuserResponse);
//
//             // Check decrypted data status
//             if (superuserResponse.decryptedData && superuserResponse.decryptedData.status === "200") {
//                 cachedUserRole = 'superuser';
//                 return 'superuser';
//             }
//         } catch (error) {
//             // Not a superuser, continue checking
//         }
//
//         // Try manager next
//         try {
//             const managerResponse = await api.get('/manager');
//
//             // Check decrypted data status
//             if (managerResponse.decryptedData && managerResponse.decryptedData.status === "200") {
//                 cachedUserRole = 'manager';
//                 return 'manager';
//             }
//         } catch (error) {
//             // Not a manager, continue checking
//         }
//
//         // Try user last
//         try {
//             const userResponse = await api.get('/user');
//
//             // Check decrypted data status
//             if (userResponse.decryptedData && userResponse.decryptedData.status === "200") {
//                 cachedUserRole = 'user';
//                 return 'user';
//             }
//         } catch (error) {
//             // Not a user either
//         }
//
//         // If we get here, we couldn't determine the role
//         return null;
//     } catch (error) {
//         console.error('Error determining user role:', error);
//         return null;
//     } finally {
//         roleCheckInProgress = false;
//     }
// };
//
// // Clear the cached role when logging out
// export const clearCachedRole = () => {
//     cachedUserRole = null;
// };




import api from './api';

// Store only the token in localStorage, not the role
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

// Get the token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated (has a token)
export const isAuthenticated = () => {
    const token = getAuthToken();
    return token !== null && token !== "undefined"; // Ensure it's a valid string
};
;

// Clear all auth data
export const logout = () => {
    localStorage.removeItem('token');
    clearCachedRole();
    // Redirect to login page
    window.location.href = '/login';
};

// Verify access to a specific route with the backend
export const verifyRouteAccess = async (route) => {
    try {
        // Map frontend routes to backend endpoints
        const routeMap = {
            '/dashboard/super-admin': '/superuser',
            '/dashboard/manager': '/manager',
            '/dashboard/user': '/user'
        };

        const endpoint = routeMap[route];
        if (!endpoint) {
            return false; // Route not in our map
        }

        const response = await api.get(endpoint);

        // Check if we have decrypted data and its status is 200
        if (response.decryptedData && response.decryptedData.status === "200") {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Route access verification failed:', error);

        // If we get a 401 or 403, the user doesn't have access
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return false;
        }

        // For other errors (like network issues), we'll default to denying access
        return false;
    }
};

// Cache for storing the user role to prevent repeated API calls
let cachedUserRole = null;
let roleCheckInProgress = false;

// Clear the cached role when logging out or when needed
export const clearCachedRole = () => {
    cachedUserRole = null;
};

// Get the user's role by checking which endpoints they can access
export const getUserRole = async () => {
    // If we already have a cached role, return it
    if (cachedUserRole) {
        return cachedUserRole;
    }

    // If a role check is already in progress, return null to prevent multiple simultaneous calls
    if (roleCheckInProgress) {
        return null;
    }

    try {
        roleCheckInProgress = true;

        // Try superuser first
        try {
            const superuserResponse = await api.get('/superuser');

            // Check decrypted data status
            if (superuserResponse.decryptedData && superuserResponse.decryptedData.status === "200") {
                cachedUserRole = 'superuser';
                return 'superuser';
            }
        } catch (error) {
            // Not a superuser, continue checking
        }

        // Try manager next
        try {
            const managerResponse = await api.get('/manager');

            // Check decrypted data status
            if (managerResponse.decryptedData && managerResponse.decryptedData.status === "200") {
                cachedUserRole = 'manager';
                return 'manager';
            }
        } catch (error) {
            // Not a manager, continue checking
        }

        // Try user last
        try {
            const userResponse = await api.get('/user');

            // Check decrypted data status
            if (userResponse.decryptedData && userResponse.decryptedData.status === "200") {
                cachedUserRole = 'user';
                return 'user';
            }
        } catch (error) {
            // Not a user either
        }

        // If we get here, we couldn't determine the role
        return null;
    } catch (error) {
        console.error('Error determining user role:', error);
        return null;
    } finally {
        roleCheckInProgress = false;
    }
};
