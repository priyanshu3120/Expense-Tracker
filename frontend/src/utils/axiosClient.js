import axios from "axios";

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000'
});

// Automatically attach JWT token to every request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Handle 401 globally — redirect to login if token expired
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('User');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
