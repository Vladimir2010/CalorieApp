import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

export const foodAPI = {
    search: (query) => api.get(`/foods/search?query=${query}`),
    create: (foodData) => api.post('/foods', foodData),
    getById: (id) => api.get(`/foods/${id}`)
};

export const logAPI = {
    getLog: (date) => api.get(`/logs/${date}`),
    addEntry: (entryData) => api.post('/logs', entryData),
    removeEntry: (date, entryId) => api.delete(`/logs/${date}/${entryId}`)
};

export const aiAPI = {
    analyze: (formData) => api.post('/ai/analyze', formData)
};

export default api;
