import { useState, useEffect } from "react";
import { accountAPI, transactionAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Plus, Wallet, CreditCard, Building2, TrendingUp, ArrowDownLeft, ArrowUpRight, Send, X  } from "lucide-react";

const ACCOUNT_TYPES = [
    { value: 'CHECKING', label: 'Checking', icon: CreditCard },
    { value: 'SAVINGS', label: 'Savings', icon: Wallet },
    { value: 'BUSINESS', label: 'Business', icon: Building2 },
    { value: 'INVESTMENT', label: 'Investment', icon: TrendingUp },
];

export default function Accounts () {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const { success, error } = useToast();

    useEffect(() => {
        fetchAccounts();
    }, []);
    
    const fetchAccounts = async () => {
        try {
            const response = await accountAPI.getAccounts();
            setAccounts(response.data.data);
        } catch (err) {
            error("Failed to fetch accounts.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    const getAccountIcon = (type) => {
        const accountType = ACCOUNT_TYPES.find(t => t.value === type);
        const Icon = accountType?.icon || Wallet;
        return <Icon size={24} />
    };

    const openTransactionModal = (account, type) => {
        setSelectedAccount(account);
        setTransactionType(type);
        setShowTransactionModal(true);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Accounts</h1>
                        <p className="page-subtitle">Manage your bank accounts</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={20} />
                        New Account
                    </button>
                </div>
            </header>

            <div className="page-content">
                {accounts.length > 0 ? (
                    <div className="accounts-grid">
                        {accounts.map((account) => (
                            <div key={account.id} className="account-card">
                                <div className="account-card-header">
                                    <div className="account-type-icon">
                                        {getAccountIcon(account.accountType)}
                                    </div>
                                    <span className={`account-status status-${account.status.toLowerCase()}`}>
                                        {account.status}
                                    </span>
                                </div>
                                
                                <h3 className="account-name">{account.accountName}</h3>
                                <p className="account-number">{account.accountNumber}</p>
                                
                                <div className="account-balance-large">
                                    {formatCurrency(account.balance)}
                                </div>
                                
                                <div className="account-type-label">
                                    {account.accountType} Account
                                </div>

                                <div className="account-actions">
                                    <button 
                                        className="btn btn-sm btn-success"
                                        onClick={() => openTransactionModal(account, 'DEPOSIT')}
                                    >
                                        <ArrowDownLeft size={16} />
                                        Deposit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-warning"
                                        onClick={() => openTransactionModal(account, 'WITHDRAW')}
                                    >
                                        <ArrowUpRight size={16} />
                                        Withdraw
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => openTransactionModal(account, 'TRANSFER')}
                                    >
                                        <Send size={16} />
                                        Transfer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Wallet size={64} />
                        <h3>No Accounts Yet</h3>
                        <p>Create your first account to get started</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={20} />
                            Create Account
                        </button>
                    </div>
                )}
            </div>

            {/* Create Account Modal */}
            {showCreateModal && (
                <CreateAccountModal 
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchAccounts();
                    }}
                />
            )}

            {/* Transaction Modal */}
            {showTransactionModal && (
                <TransactionModal
                    account={selectedAccount}
                    type={transactionType}
                    onClose={() => setShowTransactionModal(false)}
                    onSuccess={() => {
                        setShowTransactionModal(false);
                        fetchAccounts();
                    }}
                />
            )}
        </>
    );
}

// Create Account Modal Component
function CreateAccountModal({ onClose, onSuccess }) {
   const [formData, setFormData] = useState({
       accountName: '',
       accountType: 'SAVINGS',
       currency: 'PHP',
   });
   const [ loading, setLoading ] = useState(false);
   const { success, error } = useToast();

   const handleSubmit = async (e) => {
         e.preventDefault();
         setLoading(true);

         try {
             await accountAPI.createAccount(formData);
             success("Account created successfully.");
             onSuccess();
         } catch (err) {
             error(err.response?.data?.message || "Failed to create account.");
         } finally {
             setLoading(false);
         }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Create New Account</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Account Name</label>
                        <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            placeholder="e.g., My Savings"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Account Type</label>
                        <select
                            value={formData.accountType}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                        >
                            {ACCOUNT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Currency</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="PHP">PHP - Philippine Peso</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Transaction Modal Component
function TransactionModal({ account, type, onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                accountId: account.id,
                amount: parseFloat(amount),
                description,
            };

            if (type === 'DEPOSIT') {
                await transactionAPI.deposit(data);
                success("Deposit successful.");
            } else if (type === 'WITHDRAW') {
                await transactionAPI.withdraw(data);
                success("Withdrawal successful.");
            } else if (type === 'TRANSFER') {
                data.destinationAccountId = destinationAccount;
                await transactionAPI.transfer({
                    sourceAccountId: account.id,
                    destinationAccountId: destinationAccount,
                    amount: parseFloat(amount),
                    description,
                });
                success("Transfer successful.");
            }
            onSuccess();
        } catch (err) {
            error(err.response?.data?.message || "Transaction failed.");
        } finally {
            setLoading(false);
        }
    }

    const getTitle = () => {
        switch (type) {
            case 'DEPOSIT':
                return 'Deposit Money';
            case 'WITHDRAW':
                return 'Withdraw Money';
            case 'TRANSFER':
                return 'Transfer Money';
            default:
                return 'Transaction';
        }
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{getTitle()}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="transaction-account-info">
                        <p>From: <strong>{account.accountName}</strong></p>
                        <p>Balance: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)}</strong></p>
                    </div>

                    {type === 'TRANSFER' && (
                        <div className="form-group">
                            <label>Destination Account Number</label>
                            <input
                                type="text"
                                value={destinationAccount}
                                onChange={(e) => setDestinationAccount(e.target.value)}
                                placeholder="Enter account number"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Monthly savings"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}