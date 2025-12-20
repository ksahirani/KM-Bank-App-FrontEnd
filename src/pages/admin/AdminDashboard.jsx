import  { useState, useEffect, use } from 'react';
import { Link } from 'react-router-dom';
import  { adminApi } from '../../services/adminApi';
import  { useToast } from '../../context/ToastContext';
import { Users, Wallet, ArrowLeftRight, DollarSign, TrendingUp, TrendingDown, UserPlus, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await adminApi.getDashboard();
            setDashboard(response.data.data);
        } catch (err) {
            error('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Admin Dashboard</h1>
                        <p className="page-subtitle">Overview of your banking system</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Users</p>
                            <h3 className="stat-value">{dashboard?.totalUsers || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <Wallet size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Accounts</p>
                            <h3 className="stat-value">{dashboard?.totalAccounts || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <ArrowLeftRight size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Transactions</p>
                            <h3 className="stat-value">{dashboard?.totalTransactions || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon gold">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">System Balance</p>
                            <h3 className="stat-value">{formatCurrency(dashboard?.systemBalance)}</h3>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="stats-grid secondary">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Deposits</p>
                            <h3 className="stat-value">{formatCurrency(dashboard?.totalDeposits)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <TrendingDown size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Withdrawals</p>
                            <h3 className="stat-value">{formatCurrency(dashboard?.totalWithdrawals)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <UserPlus size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">New Users Today</p>
                            <h3 className="stat-value">{dashboard?.newUsersToday || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <Activity size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Transactions Today</p>
                            <h3 className="stat-value">{dashboard?.transactionsToday || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-grid">
                    {/* Recent Users */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Users</h3>
                            <Link to="/admin/users" className="card-link">View All</Link>
                        </div>
                        <div className="card-body">
                            {dashboard?.recentUsers?.length > 0 ? (
                                <div className="admin-list">
                                    {dashboard.recentUsers.slice(0, 5).map((user) => (
                                        <div key={user.id} className="admin-list-item">
                                            <div className="user-avatar-sm">
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </div>
                                            <div className="item-info">
                                                <h4>{user.firstName} {user.lastName}</h4>
                                                <p>{user.email}</p>
                                            </div>
                                            <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                                                {user.enabled ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-message">No users yet</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Transactions</h3>
                            <Link to="/admin/transactions" className="card-link">View All</Link>
                        </div>
                        <div className="card-body">
                            {dashboard?.recentTransactions?.length > 0 ? (
                                <div className="admin-list">
                                    {dashboard.recentTransactions.slice(0, 5).map((tx) => (
                                        <div key={tx.id} className="admin-list-item">
                                            <div className={`tx-icon-sm ${tx.transactionType.toLowerCase()}`}>
                                                <ArrowLeftRight size={16} />
                                            </div>
                                            <div className="item-info">
                                                <h4>{tx.transactionType}</h4>
                                                <p>{formatDate(tx.createdAt)}</p>
                                            </div>
                                            <span className="tx-amount">
                                                {formatCurrency(tx.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-message">No transactions yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}