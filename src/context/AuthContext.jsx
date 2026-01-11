import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
            // Fetch fresh user data from API
            const response = await userAPI.getProfile();
            const freshUser = response.data.data;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
            
        } catch (error) {
            console.error('Failed to load user:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        console.log('Full login response:', response.data);
        
        // The response structure is: { success, message, data: { token, type, user } }
        const responseData = response.data.data;
        const tokenValue = responseData.token;
        const userData = responseData.user;

        console.log('Extracted token:', tokenValue);
        console.log('Extracted user:', userData);

        if (!tokenValue) {
            throw new Error('No token received from server');
        }

        // Save token first
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);

        // Save user data
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;  // Return the user data
        }

        return null;
    };

    const register = async (data) => {
        const response = await authAPI.register(data);
        console.log('Full register response:', response.data);
        
        const responseData = response.data.data;
        const tokenValue = responseData.token;
        const userData = responseData.user;

        if (!tokenValue) {
            throw new Error('No token received from server');
        }

        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);

        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }

        return null;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await userAPI.getProfile();
            const freshUser = response.data.data;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
            return freshUser;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const isAuthenticated = () => !!token && !!user;
    const isAdmin = () => user?.role === 'ADMIN';

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};