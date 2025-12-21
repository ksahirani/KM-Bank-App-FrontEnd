import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
    createAccount: (data) => api.post('/accounts', data),
    updateAccount: (id, data) => api.patch(`/accounts/${id}`, data),
    closeAccount: (id) => api.delete(`/accounts/${id}`),
};

// Transaction APIs
export const transactionAPI = {
    getTransactions: (accountId, page = 0, size = 10) => 
        api.get(`/transactions?accountId=${accountId}&page=${page}&size=${size}`),
    deposit: (data) => api.post('/transactions/deposit', data),
    withdraw: (data) => api.post('/transactions/withdraw', data),
    transfer: (data) => api.post('/transactions/transfer', data),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    changePassword: (data) => api.put('/users/me/password', data),
};

export default api;