import { useState, useEffect, use } from "react";
import { adminAPI } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import { Barchart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, TrendingDown, Users, Wallet } from "lucide-react";

const  COLORS = ['#1e4d8c', '#d4af37', '#10b981', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    const  { error } = useToast();

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getAnalytics(period);
            setAnalytics(response.data.data);
        } catch (err) {
            error("Failed to fetch analytics data.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { 
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
         }).format(amount || 0);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Analytics</h1>
                        <p className="page-subtitle">System performance and insights</p>
                    </div>
                    <div className="period-selector">
                        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Summary Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Deposits</p>
                            <h3 className="stat-value">{formatCurrency(analytics?.totalDeposits)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <TrendingDown size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Withdrawals</p>
                            <h3 className="stat-value">{formatCurrency(analytics?.totalWithdrawals)}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">New Users</p>
                            <h3 className="stat-value">{analytics?.newUsers || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <Wallet size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">New Accounts</p>
                            <h3 className="stat-value">{analytics?.newAccounts || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                    {/* Daily Stats Chart */}
                    <div className="card chart-card">
                        <div className="card-header">
                            <h3 className="card-title">Daily Transaction Volume</h3>
                        </div>
                        <div className="card-body">
                            {analytics?.dailyStats?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analytics.dailyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="deposits" 
                                            stroke="#10b981" 
                                            name="Deposits"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="withdrawals" 
                                            stroke="#ef4444" 
                                            name="Withdrawals"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-message">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Account Types Chart */}
                    <div className="card chart-card">
                        <div className="card-header">
                            <h3 className="card-title">Account Distribution</h3>
                        </div>
                        <div className="card-body">
                            {analytics?.accountTypeStats?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.accountTypeStats}
                                            dataKey="count"
                                            nameKey="accountType"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ accountType, count }) => `${accountType}: ${count}`}
                                        >
                                            {analytics.accountTypeStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-message">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Type Stats Table */}
                {analytics?.accountTypeStats?.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Account Type Statistics</h3>
                        </div>
                        <div className="card-body">
                            <div className="admin-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Account Type</th>
                                            <th>Count</th>
                                            <th>Total Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.accountTypeStats.map((stat, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="type-indicator">
                                                        <span 
                                                            className="color-dot" 
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        ></span>
                                                        {stat.accountType}
                                                    </div>
                                                </td>
                                                <td>{stat.count}</td>
                                                <td>{formatCurrency(stat.totalBalance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}