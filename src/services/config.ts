import axios from 'axios';

// API Configuration
export const API_BASE_URL = "https://worldagencyadmin.runasp.net/api/admin";

// Axios instance for REST API calls
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
