import axios from 'axios';

// IMPORTANT: Replace this with your computer's local IP (e.g. 192.168.x.x)
// Run 'ipconfig' in your terminal to find it.
const API_BASE_URL = 'http://192.168.100.118:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
