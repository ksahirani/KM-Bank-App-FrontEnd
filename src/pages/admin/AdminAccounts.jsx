import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminApi';
import { useToast } from "../../context/ToastContext";
import { Eye, X} from  "lucide-react";

export default function AdminAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { success, error } = useToast();
    
    useEffect(() => {
        fetchAccounts();
    }, [page, statusFilter]);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getAccounts({ 
                page,
                size: 10, 
                status: statusFilter !== 'all' ? statusFilter : undefined,
             });
             setAccounts(response.data.data.content);
             setTotalPages(response.data.data.totalPages);
        } catch (err) {
            error("Failed to fetch accounts.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (accountId, newStatus) => {
        try {
            await adminAPI.updateAccountStatus(accountId, newStatus);
            success("Account status updated successfully.");
            fetchAccounts();
        } catch (err) {
            error("Failed to update account status.");
        }
    };

    const handleViewDetail = async (accountId) => {
        try {
            const response = await adminAPI.getAccountDetail(accountId);
            setSelectedAccount(response.data.data);
            setShowDetailModal(true);
        } catch (err) {
            error("Failed to fetch account details.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Accounts</h1>
                        <p className="page-subtitle">Manage all bank accounts</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Filters */}
                <div className="card">
                    <div className="card-body">
                        <div className="filters-row">
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <option value="all">All Accounts</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="FROZEN">Frozen</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : accounts.length > 0 ? (
                            <>
                                <div className="admin-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Account</th>
                                                <th>Owner</th>
                                                <th>Type</th>
                                                <th>Balance</th>
                                                <th>Status</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accounts.map((account) => (
                                                <tr key={account.id}>
                                                    <td>
                                                        <div>
                                                            <strong>{account.accountName}</strong>
                                                            <p className="text-muted">{account.accountNumber}</p>
                                                        </div>
                                                    </td>
                                                    <td>{account.ownerName || 'N/A'}</td>
                                                    <td>{account.accountType}</td>
                                                    <td>{formatCurrency(account.balance)}</td>
                                                    <td>
                                                        <select
                                                            value={account.status}
                                                            onChange={(e) => handleStatusChange(account.id, e.target.value)}
                                                            className="status-select"
                                                        >
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="FROZEN">Frozen</option>
                                                            <option value="CLOSED">Closed</option>
                                                        </select>
                                                    </td>
                                                    <td>{formatDate(account.createdAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn-icon"
                                                            onClick={() => handleViewDetail(account.id)}
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
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
                            <div className="empty-message">No accounts found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Detail Modal */}
            {showDetailModal && selectedAccount && (
                <div className="modal-overlay">
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <h2>Account Details</h2>
                            <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Account Name</span>
                                    <span className="value">{selectedAccount.account.accountName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Account Number</span>
                                    <span className="value">{selectedAccount.account.accountNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Owner</span>
                                    <span className="value">{selectedAccount.ownerName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Balance</span>
                                    <span className="value">{formatCurrency(selectedAccount.account.balance)}</span>
                                </div>
                            </div>

                            {selectedAccount.recentTransactions?.length > 0 && (
                                <div className="detail-section">
                                    <h4>Recent Transactions</h4>
                                    <div className="detail-list">
                                        {selectedAccount.recentTransactions.map((tx) => (
                                            <div key={tx.id} className="detail-list-item">
                                                <div>
                                                    <strong>{tx.transactionType}</strong>
                                                    <p>{tx.description || 'No description'}</p>
                                                </div>
                                                <span className={tx.isCredit ? 'text-success' : 'text-danger'}>
                                                    {tx.isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </span>
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