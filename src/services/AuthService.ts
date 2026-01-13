import { apiClient } from './config';
import type { User, LoginCredentials, RegisterData } from '../types/User';

// Inactivity timeout: 2 minutes
const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds
let inactivityTimer: number | null = null;

export const AuthService = {
    async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<User> {
        try {
            const response = await apiClient.post('/login', credentials);
            const user = response.data;

            // Store in sessionStorage by default, localStorage only if "Remember me" is checked
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(user));
            storage.setItem('rememberMe', rememberMe.toString());

            // Start inactivity timer
            this.startInactivityTimer();

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
                Cedula: data.cedula || '',
            };

            const response = await apiClient.post('/usuarios', payload);
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    logout(): void {
        // Clear from both storages
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('rememberMe');

        // Clear inactivity timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }

        window.location.href = '/';
    },

    getCurrentUser(): User | null {
        // Check sessionStorage first, then localStorage
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) return JSON.parse(sessionUser);

        const localUser = localStorage.getItem('user');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';

        // Only return localStorage user if "Remember me" was checked
        if (localUser && rememberMe) {
            return JSON.parse(localUser);
        }

        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.EsAdmin || false;
    },

    async updateProfile(id: number, data: Partial<User> & { password?: string }): Promise<User> {
        try {
            const payload = {
                Nombre: data.Nombre,
                Apellido: data.Apellido,
                Telefono: data.Telefono || '',
                Password: data.password
            };

            const adminUrl = "https://worldagencyadmin.runasp.net/api/admin";
            const response = await apiClient.put(`${adminUrl}/usuarios/${id}`, payload);
            const updatedUser = response.data;

            // Update storage
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.Id === id) {
                const newUserData = { ...currentUser, ...updatedUser };
                const storage = sessionStorage.getItem('user') ? sessionStorage : localStorage;
                storage.setItem('user', JSON.stringify(newUserData));
            }

            return updatedUser;
        } catch (error: any) {
            console.error('Update profile error:', error);
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    // Start inactivity timer
    startInactivityTimer(): void {
        // Clear existing timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        // Set new timer
        inactivityTimer = setTimeout(() => {
            console.log('User inactive for 2 minutes. Logging out...');
            this.logout();
        }, INACTIVITY_TIMEOUT);
    },

    // Reset inactivity timer
    resetInactivityTimer(): void {
        if (this.isAuthenticated()) {
            this.startInactivityTimer();
        }
    },

    // Initialize activity listeners
    initActivityListeners(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.addEventListener(event, () => this.resetInactivityTimer(), true);
        });
    },

    // Clean up activity listeners
    removeActivityListeners(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.removeEventListener(event, () => this.resetInactivityTimer(), true);
        });
    }
};
