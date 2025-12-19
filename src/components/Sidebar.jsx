import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, Settings, LogOut, Landmark, Shield } from 'lucide-react';

export default function Sidebar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Landmark size={32} />
                <span>KM Bank</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="nav-item">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/accounts" className="nav-item">
                    <Wallet size={20} />
                    <span>Accounts</span>
                </NavLink>
                <NavLink to="/transactions" className="nav-item">
                    <ArrowLeftRight size={20} />
                    <span>Transactions</span>
                </NavLink>
                <NavLink to="/cards" className="nav-item">
                    <CreditCard size={20} />
                    <span>Cards</span>
                </NavLink>
                <NavLink to="/settings" className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                {isAdmin() && (
                    <NavLink to="/admin" className="nav-item admin-link">
                        <Shield size={20} />
                        <span>Admin Panel</span>
                    </NavLink>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user?.firstName} {user?.lastName}</span>
                        <span className="user-email">{user?.email}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
}