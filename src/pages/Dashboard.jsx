import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.getDashboard();
            console.log('Dashboard response:', response.data);
            setDashboardData(response.data.data);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Welcome back, {user?.firstName || 'User'}!</h1>
                        <p className="page-subtitle">Here's your financial overview</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <Wallet size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Balance</p>
                            <h3 className="stat-value">{formatCurrency(dashboardData?.totalBalance)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Monthly Income</p>
                            <h3 className="stat-value">{formatCurrency(dashboardData?.monthlyIncome)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <TrendingDown size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Monthly Expenses</p>
                            <h3 className="stat-value">{formatCurrency(dashboardData?.monthlyExpenses)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <ArrowLeftRight size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Transactions</p>
                            <h3 className="stat-value">{dashboardData?.totalTransactions || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Accounts Section */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Your Accounts</h3>
                    </div>
                    <div className="card-body">
                        {dashboardData?.accounts && dashboardData.accounts.length > 0 ? (
                            <div className="accounts-list">
                                {dashboardData.accounts.map((account) => (
                                    <div key={account.id} className="account-item">
                                        <div className="account-info">
                                            <h4>{account.accountName}</h4>
                                            <p>{account.accountNumber}</p>
                                        </div>
                                        <div className="account-balance">
                                            {formatCurrency(account.balance)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No accounts yet. Create one to get started!</p>
                        )}
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Transactions</h3>
                    </div>
                    <div className="card-body">
                        {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                            <div className="transactions-list">
                                {dashboardData.recentTransactions.map((tx) => (
                                    <div key={tx.id} className="transaction-item">
                                        <div className="transaction-info">
                                            <h4>{tx.description || tx.transactionType}</h4>
                                            <p>{new Date(tx.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`transaction-amount ${tx.isCredit ? 'credit' : 'debit'}`}>
                                            {tx.isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No transactions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}