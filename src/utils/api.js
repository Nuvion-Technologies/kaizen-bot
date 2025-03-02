import axios from 'axios';
import { encryptMessage, parseApiResponse } from './crypto';
import { getAuthToken, logout } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL;

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

// Add response interceptor to decrypt data and handle auth errors
api.interceptors.response.use(
    (response) => {
        if (response.data && response.data.data) {
            const decryptedData = parseApiResponse(response.data.data);
            return { ...response, decryptedData };
        }
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors (expired or invalid token)
        if (error.response && error.response.status === 401) {
            // Log the user out
            logout();
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (credentials) => {
    const encryptedData = encryptMessage(JSON.stringify(credentials));
    try {
        const response = await api.post('/login', { data: encryptedData });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    const encryptedData = encryptMessage(JSON.stringify(userData));
    try {
        const response = await api.post('/register', { data: encryptedData });
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    const encryptedData = encryptMessage(JSON.stringify({ email }));
    try {
        const response = await api.post('/forgot-password', { data: encryptedData });
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
        return response;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const activateUser = async (userId) => {
    const encryptedData = encryptMessage(JSON.stringify({ userId }));
    try {
        const response = await api.post('/user/activate', { data: encryptedData });
        return response;
    } catch (error) {
        console.error('Activate user error:', error);
        throw error;
    }
};

export const deactivateUser = async (userId) => {
    const encryptedData = encryptMessage(JSON.stringify({ userId }));
    try {
        const response = await api.post('/user/deactivate', { data: encryptedData });
        return response;
    } catch (error) {
        console.error('Deactivate user error:', error);
        throw error;
    }
};

export const fetchManagerDashboard = async () => {
    try {
        const response = await api.get('/manager');
        return response;
    } catch (error) {
        console.error('Fetch manager dashboard error:', error);
        throw error;
    }
};

export default api;
