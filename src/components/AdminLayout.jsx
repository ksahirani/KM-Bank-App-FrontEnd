import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Wallet, ArrowLeftRight, BarChart3, ArrowLeft, LogOut, Shield } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <aside className="sidebar admin-sidebar">
                <div className="sidebar-header">
                    <Shield size={32} />
                    <span>Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className="nav-item">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/users" className="nav-item">
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                    <NavLink to="/admin/accounts" className="nav-item">
                        <Wallet size={20} />
                        <span>Accounts</span>
                    </NavLink>
                    <NavLink to="/admin/transactions" className="nav-item">
                        <ArrowLeftRight size={20} />
                        <span>Transactions</span>
                    </NavLink>
                    <NavLink to="/admin/analytics" className="nav-item">
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </NavLink>

                    <div className="nav-divider"></div>

                    <NavLink to="/dashboard" className="nav-item back-link">
                        <ArrowLeft size={20} />
                        <span>Back to App</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar admin-avatar">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}