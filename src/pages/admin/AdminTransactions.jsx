import { useState, useEffect } from 'react';
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [typeFilter, setTypeFilter] = useState('all');

    const { error } = useToast();

    useEffect(() => {
        fetchTransactions();
    }, [page, typeFilter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getTransactions({ 
                page,
                size: 15,
                type: typeFilter !== 'all' ? typeFilter : undefined,
            });
            setTransactions(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            error("Failed to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Transactions</h1>
                        <p className="page-subtitle">View all system transactions</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Filters */}
                <div className="card">
                    <div className="card-body">
                        <div className="filters-row">
                            <div className="form-group">
                                <label>Transaction Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <option value="all">All Types</option>
                                    <option value="DEPOSIT">Deposits</option>
                                    <option value="WITHDRAWAL">Withdrawals</option>
                                    <option value="TRANSFER">Transfers</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : transactions.length > 0 ? (
                            <>
                                <div className="admin-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Reference</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((tx) => (
                                                <tr key={tx.id}>
                                                    <td>
                                                        <div className="tx-type">
                                                            {getTransactionIcon(tx.transactionType)}
                                                            <span>{tx.transactionType}</span>
                                                        </div>
                                                    </td>
                                                    <td className="tx-reference">{tx.referenceNumber}</td>
                                                    <td>{tx.description || '-'}</td>
                                                    <td className="tx-amount">
                                                        {formatCurrency(tx.amount)}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${tx.status.toLowerCase()}`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(tx.createdAt)}</td>
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
                            <div className="empty-message">No transactions found</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
