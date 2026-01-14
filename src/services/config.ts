import axios from 'axios';

// Legacy API for public data (tours, search, reservas, etc.)
export const LEGACY_API_URL = "https://worldagency.runasp.net/api/v1/integracion/paquetes";

// Gateway API for auth and user operations
export const GATEWAY_API_URL = "https://worldagencyadmin.runasp.net/api/admin";

// Axios instance for legacy REST API calls (public data)
export const apiClient = axios.create({
    baseURL: LEGACY_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios instance for gateway API calls (auth and user management)
export const gatewayClient = axios.create({
    baseURL: GATEWAY_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// For backwards compatibility, also export API_BASE_URL
export const API_BASE_URL = LEGACY_API_URL;
