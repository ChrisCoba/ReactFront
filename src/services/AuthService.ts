import { apiClient } from './config';
import type { User, LoginCredentials, RegisterData } from '../types/User';

export const AuthService = {
    async login(credentials: LoginCredentials): Promise<User> {
        try {
            const response = await apiClient.post('/login', credentials);
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    async register(data: RegisterData): Promise<User> {
        try {
            const payload = {
                Email: data.email,
                Password: data.password,
                Nombre: data.nombre,
                Apellido: data.apellido,
                ClaveAdmin: data.claveAdmin || '',
            };

            const response = await apiClient.post('/usuarios', payload);
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    logout(): void {
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.EsAdmin || false;
    },
};
