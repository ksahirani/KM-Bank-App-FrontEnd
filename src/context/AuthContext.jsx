import { createContext, useContext, useState, useEffect, use } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
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
            // If token is invalid, logout
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };


  const login = async (email, password) => {
    const response = await authAPI.login({email, password});
    const {token, user} = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

    const register = async (data) => {
    const response = await authAPI.register(data);
    const {token, user} = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // New function to refresh user data
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

    // New function to update user locally (for immediate UI update)
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    
    const isAuthenticated = () => !!token && !!user;

    const isAdmin = () => {
    return user?.role === "ADMIN";
  };

    return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, updateUser, isAdmin, isAuthenticated, isAdmin,}}>
        {children}          
    </AuthContext.Provider>
    );
};