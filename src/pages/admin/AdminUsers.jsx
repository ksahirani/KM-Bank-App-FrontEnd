import { useState, useEffect } from "react";
import { adminAPI } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import { Search, UserCheck, UserX, Shield, Trash2, Eye, X } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { success, error } = useToast();

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers({
                 page,
                 size: 10,
                 search: search || undefined,
            });
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await adminAPI.toggleUserStatus(userId);
            success("User status updated.");
            fetchUsers();
        } catch (err) {
            error("Failed to update user status.");
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            success("User role updated.");
            fetchUsers();
        } catch (err) {
            error("Failed to update user role.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) 
            return;

        try {
            await adminAPI.deleteUser(userId);
            success("User deleted.");
            fetchUsers();
        } catch (err) {
            error(err.response?.data?.message || "Failed to delete user.");
        }
    };

    const handleViewDetail = async (userId) => {
        try {
            const response = await adminAPI.getUserDetail(userId);
            setSelectedUser(response.data.data);
            setShowDetailModal(true);
        } catch (err) {
            error("Failed to fetch user details.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Users</h1>
                        <p className="page-subtitle">Manage system users</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Search */}
                <div className="card">
                    <div className="card-body">
                        <div className="search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : users.length > 0 ? (
                            <>
                                <div className="admin-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-avatar-sm">
                                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                            </div>
                                                            <span>{user.firstName} {user.lastName}</span>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                            className="role-select"
                                                        >
                                                            <option value="USER">User</option>
                                                            <option value="ADMIN">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                                                            {user.enabled ? 'Active' : 'Disabled'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(user.createdAt)}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-icon"
                                                                onClick={() => handleViewDetail(user.id)}
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                className="btn-icon"
                                                                onClick={() => handleToggleStatus(user.id)}
                                                                title={user.enabled ? 'Disable User' : 'Enable User'}
                                                            >
                                                                {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
                                                            </button>
                                                            <button
                                                                className="btn-icon danger"
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                        >
                                            Previous
                                        </button>
                                        <span>Page {page + 1} of {totalPages}</span>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-message">No users found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {showDetailModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="user-detail-header">
                                <div className="user-avatar-lg">
                                    {selectedUser.user.firstName?.charAt(0)}{selectedUser.user.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <h3>{selectedUser.user.firstName} {selectedUser.user.lastName}</h3>
                                    <p>{selectedUser.user.email}</p>
                                </div>
                            </div>

                            <div className="detail-stats">
                                <div className="detail-stat">
                                    <span className="label">Total Balance</span>
                                    <span className="value">{formatCurrency(selectedUser.totalBalance)}</span>
                                </div>
                                <div className="detail-stat">
                                    <span className="label">Accounts</span>
                                    <span className="value">{selectedUser.accounts?.length || 0}</span>
                                </div>
                                <div className="detail-stat">
                                    <span className="label">Transactions</span>
                                    <span className="value">{selectedUser.transactionCount || 0}</span>
                                </div>
                            </div>

                            {selectedUser.accounts?.length > 0 && (
                                <div className="detail-section">
                                    <h4>Accounts</h4>
                                    <div className="detail-list">
                                        {selectedUser.accounts.map((account) => (
                                            <div key={account.id} className="detail-list-item">
                                                <div>
                                                    <strong>{account.accountName}</strong>
                                                    <p>{account.accountNumber}</p>
                                                </div>
                                                <span>{formatCurrency(account.balance)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
