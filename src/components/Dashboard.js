import React from 'react';

const Dashboard = ({ contractBalance, shmPrice, transactions, onPageChange }) => {
  const totalPayments = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalEmployees = transactions.reduce((sum, tx) => sum + tx.recipients, 0);
  const avgPayment = totalPayments > 0 ? totalPayments / transactions.length : 0;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor your payroll operations and financial metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{parseFloat(contractBalance).toFixed(4)} SHM</div>
            <div className="stat-label">Contract Balance</div>
            <div className="stat-change">≈ ${(parseFloat(contractBalance) * shmPrice).toFixed(2)} USD</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">Total Transactions</div>
            <div className="stat-change">All time</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-label">Employees Paid</div>
            <div className="stat-change">Cumulative</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <div className="stat-value">{totalPayments.toFixed(2)} SHM</div>
            <div className="stat-label">Total Paid Out</div>
            <div className="stat-change">≈ ${(totalPayments * shmPrice).toFixed(2)} USD</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => onPageChange('payroll')}>
            <div className="action-icon">💰</div>
            <div className="action-content">
              <h3>New Payroll</h3>
              <p>Create and execute a new payroll batch</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={() => onPageChange('history')}>
            <div className="action-icon">📋</div>
            <div className="action-content">
              <h3>View History</h3>
              <p>Review past transactions and payments</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={() => onPageChange('analytics')}>
            <div className="action-icon">📈</div>
            <div className="action-content">
              <h3>Analytics</h3>
              <p>Analyze payroll trends and metrics</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <button className="view-all-btn" onClick={() => onPageChange('history')}>
            View All
          </button>
        </div>
        
        <div className="activity-list">
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No transactions yet</h3>
              <p>Start by creating your first payroll batch</p>
              <button className="empty-cta" onClick={() => onPageChange('payroll')}>
                Create Payroll
              </button>
            </div>
          ) : (
            recentTransactions.map((tx, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {tx.type === 'Payroll' ? '💰' : '📥'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {tx.type} - {tx.recipients} employee{tx.recipients > 1 ? 's' : ''}
                  </div>
                  <div className="activity-details">
                    {tx.totalAmount.toFixed(4)} SHM • {tx.timestamp}
                  </div>
                </div>
                <div className="activity-status">
                  <div className="status-badge success">Completed</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Market Info */}
      <div className="market-info">
        <h2>Market Information</h2>
        <div className="market-card">
          <div className="market-item">
            <div className="market-label">SHM Price</div>
            <div className="market-value">${shmPrice.toFixed(4)} USD</div>
          </div>
          <div className="market-item">
            <div className="market-label">Network</div>
            <div className="market-value">Shardeum Unstablenet</div>
          </div>
          <div className="market-item">
            <div className="market-label">Status</div>
            <div className="market-value">
              <span className="status-dot active"></span>
              Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;