import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = () => {
            if (isAuthenticated()) {
                const currentUser = getCurrentUser();
                setUser(currentUser);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const data = await loginService({ email, password });
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const data = await registerService(userData);
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        logoutService();
        setUser(null);
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'Admin';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: () => !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

