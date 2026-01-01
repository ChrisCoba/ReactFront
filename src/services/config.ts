import axios from 'axios';

// API Configuration
export const API_BASE_URL = "https://worldagency.runasp.net/api/v1/integracion/paquetes";

// Axios instance for REST API calls
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
