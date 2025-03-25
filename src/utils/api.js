import axios from 'axios';
import {decryptMessage, encryptMessage, parseApiResponse} from './crypto';
import { getAuthToken, logout } from './auth.js';
export { encryptMessage } from './crypto';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = API_URL; // For consistency with existing code

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//
// // Add response interceptor to decrypt data and handle auth errors
// api.interceptors.response.use(
//     (response) => {
//         if (typeof response.data === 'string' && response.data.includes('iv') && response.data.includes('ct')) {
//             try {
//                 const decryptedData = parseApiResponse(response.data.data);
//                 return { ...response, decryptedData };
//             } catch (error) {
//                 console.error('Failed to decrypt response data:', error);
//                 return response;
//             }
//         }
//         return response;
//     },
//     (error) => {
//         // Handle 401 Unauthorized errors (expired or invalid token)
//         if (error.response && error.response.status === 401) {
//             // Log the user out
//             logout();
//         }
//         return Promise.reject(error);
//     }
// );


//
// api.interceptors.response.use(
//     (response) => {
//         if (response.data && response.data.data) {
//             try {
//                 const decryptedData = parseApiResponse(response.data.data);
//                 return { ...response, decryptedData };
//             } catch (error) {
//                 console.error('Failed to decrypt response data:', error);
//                 return response;
//             }
//         }
//         return response;
//     },
//     (error) => {
//         // Handle 401 Unauthorized errors (expired or invalid token)
//         if (error.response && error.response.status === 401) {
//             // Log the user out
//             logout();
//         }
//         return Promise.reject(error);
//     }
// );
//













// Add response interceptor to decrypt data and handle auth errors
api.interceptors.response.use(
    (response) => {
        // Handle encrypted data in different possible formats
        let dataToDecrypt = null;

        // Case 1: response.data.data exists (e.g., { data: { iv, ct } })
        if (response.data && response.data.data) {
            dataToDecrypt = response.data.data;
        }
        // Case 2: response.data is a string or object with iv and ct (e.g., { iv, ct } or stringified version)
        else if (response.data && (typeof response.data === 'string' || (response.data.iv && response.data.ct))) {
            dataToDecrypt = response.data;
        }

        if (dataToDecrypt) {
            try {
                const decryptedData = parseApiResponse(dataToDecrypt);
                return { ...response, decryptedData };
            } catch (error) {
                console.error('Failed to decrypt response data:', error);
                return response;
            }
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);

// Only parse if not encrypted
// api.interceptors.response.use(
//     response => {
//         if (typeof response.data === 'string' && response.data.includes('iv') && response.data.includes('ct')) {
//             return { ...response, data: response.data }; // Keep as string for decryption
//         }
//         return response;
//     },
//     error => Promise.reject(error)
// );



// Request interceptor to encrypt payload
// api.interceptors.request.use(
//     (config) => {
//         if (config.method === 'post' && config.data) {
//             config.data = { data: encryptMessage(JSON.stringify(config.data)) };
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export const loginUser = async (credentials) => {
//     console.log(credentials);
//     const data = encryptMessage(JSON.stringify(credentials));
//     console.log(data);
//     try {
//         console.log(`This is Data  ; ${data}`);
//         const response = await api.post('/login', {data});
//
//         if (response.decryptedData) {
//             const { status, message } = response.decryptedData;
//
//             if (status && status !== "200") {
//                 throw new Error(message || 'Login failed.');
//             }
//         } else {
//             throw new Error('Invalid response from server.');
//         }
//
//         return response;
//     } catch (error) {
//         console.error('Login error:', error);
//         throw error;
//     }
// };

// api.js

// api.js
export const loginUser = async (credentials) => {
    console.log(credentials);
    const data = encryptMessage(JSON.stringify(credentials));
    console.log(data);
    try {
        console.log(`This is Data  ; ${data}`);
        const response = await api.post('/login', { data });

        if (response.data && response.data.data) {
            const decryptedDataString = decryptMessage(response.data.data); // Assuming decryptMessage is your function
            const decryptedData = JSON.parse(decryptedDataString);
            console.log("Decrypted Data:", decryptedData);
            return { decryptedData };
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const verify2FALogin = async (otp, tempToken) => {
    try {
        const data = encryptMessage(JSON.stringify({ otp }));
        const response = await api.post('/user/2fa-login', { data }, {
            headers: { 'Authorization': `Bearer ${tempToken}` }
        });

        if (response.data && response.data.data) {
            const decryptedDataString = decryptMessage(response.data.data);
            const decryptedData = JSON.parse(decryptedDataString);
            console.log("2FA Decrypted Data:", decryptedData);
            return { decryptedData };
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('2FA Login error:', error);
        throw error;
    }
};


// export const registerUser = async (userData) => {
//     const encryptedData = encryptMessage(JSON.stringify(userData));
//     try {
//         const response = await api.post('/register', { data: encryptedData });
//         console.log("Add member response",response);
//         console.log("Add member deenebe",decryptMessage(response));
//         if (response.decryptedData) {
//
//             const { status, message } = response.decryptedData;
//             if (status && status !== "201") {
//
//                 throw new Error(message || 'Registration failed.');
//             }
//         } else {
//             throw new Error('Invalid response from server.');
//         }
//
//         return response;
//     } catch (error) {
//         console.error('Registration error:', error);
//         throw error;
//     }
// };







export const registerUser = async (userData) => {
    const encryptedData = encryptMessage(JSON.stringify(userData));
    try {
        const response = await api.post('/register', { data: encryptedData });
        console.log("Add member response", response);

        // Decrypt the response data
        const decryptedData = parseApiResponse(response.data.data);
        console.log("Add member decrypted", decryptedData);

        // Check the status in the decrypted data
        const { status, message } = decryptedData;
        if (status && status !== "201") {
            throw new Error(message || 'Registration failed.');
        }

        return decryptedData; // Return the decrypted data for further use
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};


export const forgotPassword = async (email) => {
    const encryptedData = encryptMessage(JSON.stringify({ email }));
    try {
        const response = await api.post('/forgot-password', { data: encryptedData });

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;

            if (status && status !== "200") {
                throw new Error(message || 'Failed to process forgot password request.');
            }
        } else {
            throw new Error('Invalid response from server.');
        }

        return response;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};


export const resetPassword = async (resetData) => {
    const encryptedData = encryptMessage(JSON.stringify(resetData));
    try {
        const response = await api.post('/reset-password', { data: encryptedData });

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;

            if (status && status !== "200") {
                throw new Error(message || 'Password reset failed.');
            }
        } else {
            throw new Error('Invalid response from server.');
        }

        return response;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const fetchSuperAdminDashboard = async () => {
    try {
        const response = await api.get('/superuser');

        if (response?.decryptedData) {
            const { status, message } = response.decryptedData;

            // Check if decryptedData has a status indicating an error
            if (status && status !== "200") {
                throw new Error(message || 'Failed to fetch dashboard data.');
            }
        } else {
            throw new Error('Invalid response from server.');
        }

        return response;
    } catch (error) {
        console.error('Fetch super admin dashboard error:', error);
        throw error;
    }
};


export const fetchUsers = async () => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({}));
        const response = await api.get('/users', { data: encryptedData });

        console.log('Full API Response:', response);

        // Check if response contains encrypted data
        if (!response || !response.data || !response.data.data) {
            throw new Error('No valid data received from server.');
        }

        // Decrypt the response data
        const decryptedString = decryptMessage(response.data.data);
        const decryptedData = JSON.parse(decryptedString);

        console.log('Decrypted Response:', decryptedData);

        // Ensure decryptedData contains users
        if (!decryptedData || !Array.isArray(decryptedData.users)) {
            throw new Error('Invalid decrypted response format.');
        }

        const users = decryptedData.users;

        // Remove duplicate users based on email
        const uniqueUsers = users.filter((user, index, self) =>
            index === self.findIndex((u) => u.email === user.email)
        );

        return uniqueUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

// Activate a user
export const activateUser = async (email) => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({ email }));
        const response = await api.post('/user/activate', { data: encryptedData });
        console.log('Activated status:', response.status);
        console.log('Activating user:', response.decryptedData);

        // Check HTTP status and decrypted data
        if (response.status === 200 && response.data && response.decryptedData) {
            const { status, message } = response.decryptedData;
            // Check decrypted status (comes as string "200")
            if (status === "200") {
                return { success: true, message }; // Return success and message
            } else {
                throw new Error(message || 'User activation failed: Invalid status in decrypted data');
            }
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error in activateUser:', error);
        throw error;
    }
};

// Deactivate a user
export const deactivateUser = async (email) => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({ email }));
        const response = await api.post('/user/deactivate', { data: encryptedData });
        console.log('Deactivated status:', response.status);
        console.log('Deactivated user:', response.decryptedData);

        // Check HTTP status and decrypted data
        if (response.status === 200 && response.data && response.decryptedData) {
            const { status, message } = response.decryptedData;
            // Check decrypted status (comes as string "200")
            if (status === "200") {
                return { success: true, message }; // Return success and message
            } else {
                throw new Error(message || 'User deactivation failed: Invalid status in decrypted data');
            }
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error in deactivateUser:', error);
        throw error;
    }
};


// Fetch dashboard stats
export const fetchDashboardStats = async () => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({}));
        const response = await api.post('/manager/dashboard-stats', { data: encryptedData });

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;
            if (status && status !== "200") {
                throw new Error(message || 'Failed to fetch dashboard stats.');
            }
            return response.decryptedData.data || {};
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

// Fetch trade book
export const fetchTradeBook = async () => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({}));
        const response = await api.post('/manager/trade-book', { data: encryptedData });

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;
            if (status && status !== "200") {
                throw new Error(message || 'Failed to fetch trade book.');
            }
            return response.decryptedData.data || [];
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('Error fetching trade book:', error);
        throw error;
    }
};

// Fetch stocks
export const fetchStocks = async () => {
    try {
        const encryptedData = encryptMessage(JSON.stringify({}));
        const response = await api.get('/user/stocks', { data: encryptedData });

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;
            if (status && status !== "200") {
                throw new Error(message || 'Failed to fetch stocks.');
            }
            return response.decryptedData.data || [];
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
};

// Add new stock
export const addStock = async (stockData) => {
    try {
        const encryptedData = encryptMessage(JSON.stringify(stockData));
        const response = await api.post('/user/stocks/add', { data: encryptedData });
        console.log('Add stock:', response);

        if (response.decryptedData) {
            const { status, message } = response.decryptedData;
            if (status && status !== "201") {
                throw new Error(message || 'Failed to add stock.');
            }
            return response.decryptedData;
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        console.error('Error adding stock:', error);
        throw error;
    }
};

export const makeEncryptedRequest = async (method, url, data = {}, config = {}) => {
    try {
        const encryptedData = encryptMessage(JSON.stringify(data));
        const requestConfig = {
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'application/json',
            }
        };

        let response;
        switch (method.toLowerCase()) {
            case 'get':
                response = await api.get(url, requestConfig);
                break;
            case 'post':
                response = await api.post(url, { data: encryptedData }, requestConfig);
                break;
            default:
                throw new Error('Unsupported HTTP method');
        }

        if (response.decryptedData) {
            return response.decryptedData;
        }
        throw new Error('Invalid response from server');
    } catch (error) {
        console.error(`Error in ${method} request to ${url}:`, error);
        throw error;
    }
};

export default api;
