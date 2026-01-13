import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import type { User, LoginCredentials, RegisterData } from '../types/User';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from storage on mount
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        // Initialize activity listeners if user is authenticated
        if (currentUser) {
            AuthService.initActivityListeners();
            AuthService.startInactivityTimer();
        }

        // Cleanup on unmount
        return () => {
            AuthService.removeActivityListeners();
        };
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const loggedInUser = await AuthService.login(credentials);
        setUser(loggedInUser);
    };

    const register = async (data: RegisterData) => {
        const newUser = await AuthService.register(data);
        // Optionally auto-login after registration
        setUser(newUser);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.EsAdmin || false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
