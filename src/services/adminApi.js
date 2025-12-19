import api from './api';

export const adminAPI = {
    // Dashboard
    getDashboard: () => api.get('/admin/dashboard'),

    // Users
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserDetail: (userId) => api.get(`/admin/users/${userId}`),
    toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

    // Accounts
    getAccounts: (params) => api.get('/admin/accounts', { params }),
    getAccountDetail: (accountId) => api.get(`/admin/accounts/${accountId}`),
    updateAccountStatus: (accountId, status) => 
        api.patch(`/admin/accounts/${accountId}/status`, { status }),
    adjustBalance: (accountId, data) => 
        api.post(`/admin/accounts/${accountId}/adjust`, data),

    // Transactions
    getTransactions: (params) => api.get('/admin/transactions', { params }),
    getTransactionDetail: (transactionId) => api.get(`/admin/transactions/${transactionId}`),

    // Analytics
    getAnalytics: (period = 'month') => api.get(`/admin/analytics?period=${period}`),
};

export default adminAPI;