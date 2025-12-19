import { useState, useEffect } from "react";
import { transactionAPI, accountAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Search, Filter } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { error } = useToast();

    useEffect(() => {
        fetchAccounts();
        
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            fetchTransactions();
        }
    }, [selectedAccount, page]);

    const fetchAccounts = async () => {
        try {
            const response = await accountAPI.getAccounts();
            const accountsData = response.data.data;
            setAccounts(accountsData);
            if (accountsData.length > 0) {
                setSelectedAccount(accountsData[0].id);
            }
        } catch (err) {
            error("Failed to fetch accounts.");
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await transactionAPI.getTransactionsByAccount({
                accountId: selectedAccount,
                page,   
                size: 10,
            });
            setTransactions(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            error("Failed to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'DEPOSIT':
                return <ArrowDownLeft className="tx-icon deposit" />;
            case 'WITHDRAWAL':
                return <ArrowUpRight className="tx-icon withdrawal" />;
            case 'TRANSFER':
                return <ArrowLeftRight className="tx-icon transfer" />;
            default:
                return <ArrowLeftRight className="tx-icon" />;
        }
    };
    
    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Transactions</h1>
                        <p className="page-subtitle">View your transaction history</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Account Filter */}
                <div className="card">
                    <div className="card-body">
                        <div className="filters-row">
                            <div className="form-group">
                                <label>Select Account</label>
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => {
                                        setSelectedAccount(e.target.value);
                                        setPage(0);
                                    }}
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountName} - {account.accountNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Transaction History</h3>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : transactions.length > 0 ? (
                            <>
                                <div className="transactions-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Reference</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Balance</th>
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
                                                    <td>{tx.description || '-'}</td>
                                                    <td className="tx-reference">{tx.referenceNumber}</td>
                                                    <td>{formatDate(tx.createdAt)}</td>
                                                    <td className={`tx-amount ${tx.isCredit ? 'credit' : 'debit'}`}>
                                                        {tx.isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                                                    </td>
                                                    <td>{formatCurrency(tx.balanceAfter)}</td>
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