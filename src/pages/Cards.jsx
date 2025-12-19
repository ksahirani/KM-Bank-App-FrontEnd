import { useState } from 'react';
import { CreditCard, Plus, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function Cards() {
    const [showCardNumber, setShowCardNumber] = useState({});

    // Mock data - In real app, fetch from API
    const cards = [
        {
            id: 1,
            cardNumber: '4532 •••• •••• 7890',
            fullNumber: '4532 1234 5678 7890',
            cardHolder: 'KENON SAHIRANI',
            expiryDate: '12/27',
            type: 'VISA',
            status: 'ACTIVE',
            balance: 5000.00,
        },
        {
            id: 2,
            cardNumber: '5412 •••• •••• 3456',
            fullNumber: '5412 7534 8901 3456',
            cardHolder: 'KENON SAHIRANI',
            expiryDate: '08/26',
            type: 'MASTERCARD',
            status: 'ACTIVE',
            balance: 2500.00,
        },
    ];

    const toggleCardNumber = (cardId) => {
        setShowCardNumber(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Cards</h1>
                        <p className="page-subtitle">Manage your debit and credit cards</p>
                    </div>
                    <button className="btn btn-primary">
                        <Plus size={20} />
                        Request New Card
                    </button>
                </div>
            </header>

            <div className="page-content">
                {cards.length > 0 ? (
                    <div className="cards-grid">
                        {cards.map((card) => (
                            <div key={card.id} className={`bank-card ${card.type.toLowerCase()}`}>
                                <div className="card-chip"></div>
                                <div className="card-type">{card.type}</div>
                                
                                <div className="card-number">
                                    {showCardNumber[card.id] ? card.fullNumber : card.cardNumber}
                                    <button 
                                        className="toggle-number"
                                        onClick={() => toggleCardNumber(card.id)}
                                    >
                                        {showCardNumber[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                
                                <div className="card-details">
                                    <div className="card-holder">
                                        <span className="label">Card Holder</span>
                                        <span className="value">{card.cardHolder}</span>
                                    </div>
                                    <div className="card-expiry">
                                        <span className="label">Expires</span>
                                        <span className="value">{card.expiryDate}</span>
                                    </div>
                                </div>

                                <div className="card-balance">
                                    Available: {formatCurrency(card.balance)}
                                </div>

                                <div className="card-actions">
                                    <button className="btn btn-sm btn-secondary">
                                        <Lock size={16} />
                                        Lock Card
                                    </button>
                                    <button className="btn btn-sm btn-secondary">
                                        Settings
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <CreditCard size={64} />
                        <h3>No Cards Yet</h3>
                        <p>Request your first card to get started</p>
                        <button className="btn btn-primary">
                            <Plus size={20} />
                            Request Card
                        </button>
                    </div>
                )}

                {/* Card Information */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <div className="card-header">
                        <h3 className="card-title">Card Features</h3>
                    </div>
                    <div className="card-body">
                        <div className="features-grid">
                            <div className="feature-item">
                                <div className="feature-icon blue">
                                    <Lock size={24} />
                                </div>
                                <div className="feature-content">
                                    <h4>Instant Lock</h4>
                                    <p>Lock your card instantly if lost or stolen</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon green">
                                    <CreditCard size={24} />
                                </div>
                                <div className="feature-content">
                                    <h4>Contactless Payment</h4>
                                    <p>Tap to pay for quick transactions</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon purple">
                                    <Eye size={24} />
                                </div>
                                <div className="feature-content">
                                    <h4>Real-time Alerts</h4>
                                    <p>Get notified for every transaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}