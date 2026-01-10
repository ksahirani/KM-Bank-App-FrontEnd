import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401/403 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Check if it's a token issue
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

// Dashboard API
export const dashboardAPI = {
    getDashboard: () => api.get('/dashboard'),
};

// Account APIs
export const accountAPI = {
    getAccounts: () => api.get('/accounts'),
    getAccount: (id) => api.get(`/accounts/${id}`),
    getAccountByNumber: (accountNumber) => api.get(`/accounts/number/${accountNumber}`),
    createAccount: (data) => api.post('/accounts', data),
    updateAccount: (id, data) => api.patch(`/accounts/${id}`, data),
    closeAccount: (id) => api.delete(`/accounts/${id}`),
};

// Transaction APIs
export const transactionAPI = {
    getTransactions: (params) => {
      const { accountId, page = 0, size = 10 } = params;
      return api.get(`/transactions?accountId=${accountId}&page=${page}&size=${size}`);
    },
    getTransaction: (id) => api.get(`/transactions/${id}`),    
    deposit: (data) => api.post('/transactions/deposit', data),
    withdraw: (data) => api.post('/transactions/withdraw', data),
    transfer: (data) => api.post('/transactions/transfer', data),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.patch('/users/me', data),
    changePassword: (data) => api.put('/users/me/password', data),
};

// Admin APIs
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserDetail: (userId) => api.get(`/admin/users/${userId}`),
    toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getAccounts: (params) => api.get('/admin/accounts', { params }),
    getAccountDetail: (accountId) => api.get(`/admin/accounts/${accountId}`),
    updateAccountStatus: (accountId, status) => api.patch(`/admin/accounts/${accountId}/status`, { status }),
    adjustBalance: (accountId, data) => api.post(`/admin/accounts/${accountId}/adjust`, data),
    getTransactions: (params) => api.get('/admin/transactions', { params }),
    getTransactionDetail: (transactionId) => api.get(`/admin/transactions/${transactionId}`),
    getAnalytics: (period = 'month') => api.get(`/admin/analytics?period=${period}`),
};

export default api;