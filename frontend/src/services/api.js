import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if 401
            localStorage.removeItem('token');
            // Optional: Redirect logic here or handle in UI
        }
        return Promise.reject(error);
    }
);

export default api;
