import { useState, useEffect }  from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardAPI.getDashboardData();
            setDashboardData(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Welcome back, {user?.firstName}!</h1>
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
                            <h3 className="stat-value">{formatCurrency(dashboard?.totalBalance)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Monthly Income</p>
                            <h3 className="stat-value">{formatCurrency(dashboard?.monthlyIncome)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <TrendingDown size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Monthly Expenses</p>
                            <h3 className="stat-value">{formatCurrency(dashboard?.monthlyExpenses)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <ArrowLeftRight size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Transactions</p>
                            <h3 className="stat-value">{dashboard?.totalTransactions || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Accounts */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Your Accounts</h3>
                    </div>
                    <div className="card-body">
                        {dashboard?.accounts?.length > 0 ? (
                            <div className="accounts-list">
                                {dashboard.accounts.map((account) => (
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

                {/* Recent Transactions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Transactions</h3>
                    </div>
                    <div className="card-body">
                        {dashboard?.recentTransactions?.length > 0 ? (
                            <div className="transactions-list">
                                {dashboard.recentTransactions.map((tx) => (
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