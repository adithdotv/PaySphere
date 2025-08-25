import React from 'react';

const Navigation = ({ currentPage, onPageChange, account, onConnectWallet }) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'payroll', label: 'Payroll', icon: '💰' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-logo">💎</div>
          <span className="brand-name">PaySphere</span>
        </div>
        
        <div className="nav-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-wallet">
          {!account ? (
            <button className="wallet-connect-btn" onClick={onConnectWallet}>
              <span className="wallet-icon">🔗</span>
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <div className="wallet-status">
                <div className="status-dot"></div>
                <span>Connected</span>
              </div>
              <div className="wallet-address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;