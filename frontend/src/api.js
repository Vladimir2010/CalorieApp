import axios from 'axios';

// 1. Get default from environment (during build)
const DEFAULT_URL = import.meta.env.VITE_API_URL || '';

// 2. Try to get a user-defined URL from localStorage (at runtime)
// This is critical for the APK to connect to a local server IP
const getBaseUrl = () => {
    const savedUrl = localStorage.getItem('SERVER_URL');
    return savedUrl || DEFAULT_URL;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Add an interceptor to update the baseURL if it changes in localStorage
// (Useful if the user changes settings without refreshing, though we'll likely suggest a reload)
api.interceptors.request.use((config) => {
    config.baseURL = getBaseUrl();
    return config;
});

export default api;
