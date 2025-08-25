import React, { useState } from 'react';

const HistoryPage = ({ transactions, shmPrice }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type.toLowerCase() === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortBy === 'oldest') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortBy === 'amount') {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const totalPaid = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalEmployees = transactions.reduce((sum, tx) => sum + tx.recipients, 0);

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Transaction History</h1>
        <p>Complete record of all payroll transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="history-stats">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{totalPaid.toFixed(4)} SHM</div>
            <div className="stat-label">Total Paid</div>
            <div className="stat-sublabel">≈ ${(totalPaid * shmPrice).toFixed(2)} USD</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-label">Employees Paid</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="history-controls">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="payroll">Payroll Only</option>
            <option value="deposit">Deposits Only</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {sortedTransactions.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>
              {filter === 'all' 
                ? 'No transactions have been made yet' 
                : `No ${filter} transactions found`
              }
            </p>
          </div>
        ) : (
          sortedTransactions.map((tx, index) => (
            <div key={index} className="transaction-card">
              <div className="transaction-header">
                <div className="transaction-type">
                  <div className="type-icon">
                    {tx.type === 'Payroll' ? '💰' : '📥'}
                  </div>
                  <div className="type-info">
                    <div className="type-title">{tx.type} Transaction</div>
                    <div className="type-subtitle">
                      {tx.recipients} recipient{tx.recipients > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="transaction-status">
                  <div className="status-badge success">
                    <div className="status-dot"></div>
                    Completed
                  </div>
                </div>
              </div>

              <div className="transaction-details">
                <div className="detail-row">
                  <div className="detail-label">Amount</div>
                  <div className="detail-value">
                    <div className="shm-amount">{tx.totalAmount.toFixed(4)} SHM</div>
                    <div className="usd-amount">≈ ${(tx.totalAmount * shmPrice).toFixed(2)} USD</div>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Date & Time</div>
                  <div className="detail-value">{tx.timestamp}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Transaction Hash</div>
                  <div className="detail-value">
                    <div className="hash-container">
                      <span className="hash-text">{tx.hash}</span>
                      <button 
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(tx.hash)}
                        title="Copy hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>

                {tx.type === 'Payroll' && (
                  <div className="detail-row">
                    <div className="detail-label">Average per Employee</div>
                    <div className="detail-value">
                      {(tx.totalAmount / tx.recipients).toFixed(4)} SHM
                    </div>
                  </div>
                )}
              </div>

              <div className="transaction-footer">
                <button 
                  className="view-explorer-btn"
                  onClick={() => window.open(`https://explorer-unstable.shardeum.org/transaction/${tx.hash}`, '_blank')}
                >
                  <span className="btn-icon">🔍</span>
                  View on Explorer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Options */}
      {transactions.length > 0 && (
        <div className="export-section">
          <h3>Export Data</h3>
          <div className="export-buttons">
            <button className="export-btn">
              <span className="btn-icon">📊</span>
              Export CSV
            </button>
            <button className="export-btn">
              <span className="btn-icon">📄</span>
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;