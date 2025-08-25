import React from 'react';

const AnalyticsPage = ({ transactions, shmPrice, contractBalance }) => {
  // Calculate analytics data
  const totalTransactions = transactions.length;
  const totalPaid = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalEmployees = transactions.reduce((sum, tx) => sum + tx.recipients, 0);
  const avgTransactionAmount = totalTransactions > 0 ? totalPaid / totalTransactions : 0;
  const avgEmployeesPerPayroll = totalTransactions > 0 ? totalEmployees / totalTransactions : 0;

  // Monthly data (mock for demo)
  const monthlyData = [
    { month: 'Jan', amount: 0, employees: 0 },
    { month: 'Feb', amount: 0, employees: 0 },
    { month: 'Mar', amount: totalPaid * 0.3, employees: Math.floor(totalEmployees * 0.3) },
    { month: 'Apr', amount: totalPaid * 0.7, employees: Math.floor(totalEmployees * 0.7) },
    { month: 'May', amount: totalPaid, employees: totalEmployees },
  ];

  // Recent trends
  const recentTransactions = transactions.slice(-5);
  const trend = recentTransactions.length > 1 ? 
    (recentTransactions[recentTransactions.length - 1].totalAmount > recentTransactions[0].totalAmount ? 'up' : 'down') : 'stable';

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Insights and trends for your payroll operations</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">💰</div>
            <div className="metric-trend up">↗️ +12%</div>
          </div>
          <div className="metric-value">{totalPaid.toFixed(2)} SHM</div>
          <div className="metric-label">Total Paid Out</div>
          <div className="metric-sublabel">≈ ${(totalPaid * shmPrice).toFixed(2)} USD</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">👥</div>
            <div className="metric-trend up">↗️ +8%</div>
          </div>
          <div className="metric-value">{totalEmployees}</div>
          <div className="metric-label">Employees Paid</div>
          <div className="metric-sublabel">Across all payrolls</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">📊</div>
            <div className="metric-trend stable">→ 0%</div>
          </div>
          <div className="metric-value">{avgTransactionAmount.toFixed(2)}</div>
          <div className="metric-label">Avg Transaction</div>
          <div className="metric-sublabel">SHM per payroll</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">⚡</div>
            <div className="metric-trend up">↗️ +15%</div>
          </div>
          <div className="metric-value">{avgEmployeesPerPayroll.toFixed(1)}</div>
          <div className="metric-label">Avg Team Size</div>
          <div className="metric-sublabel">Employees per payroll</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Monthly Payroll Trends</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {monthlyData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar amount-bar"
                      style={{ height: `${(data.amount / Math.max(...monthlyData.map(d => d.amount))) * 100}%` }}
                      title={`${data.amount.toFixed(2)} SHM`}
                    ></div>
                    <div 
                      className="chart-bar employee-bar"
                      style={{ height: `${(data.employees / Math.max(...monthlyData.map(d => d.employees))) * 80}%` }}
                      title={`${data.employees} employees`}
                    ></div>
                  </div>
                  <div className="chart-label">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color amount"></div>
                <span>Amount (SHM)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color employees"></div>
                <span>Employees</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Transaction Distribution</h3>
          <div className="pie-chart-placeholder">
            <div className="pie-chart">
              <div className="pie-slice payroll" style={{ '--percentage': '75%' }}>
                <span className="pie-label">Payroll<br/>75%</span>
              </div>
              <div className="pie-slice deposits" style={{ '--percentage': '25%' }}>
                <span className="pie-label">Deposits<br/>25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Growing Payroll</h4>
              <p>Your payroll operations have grown by 12% this month, indicating business expansion.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>Cost Efficiency</h4>
              <p>Using PaySphere saves approximately 85% in transaction fees compared to traditional banking.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Speed Advantage</h4>
              <p>Payments are processed instantly vs 3-5 days with traditional payroll systems.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🌍</div>
            <div className="insight-content">
              <h4>Global Reach</h4>
              <p>PaySphere enables borderless payments without geographical restrictions or banking delays.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h3>Performance Metrics</h3>
        <div className="performance-grid">
          <div className="performance-item">
            <div className="performance-label">Success Rate</div>
            <div className="performance-value">100%</div>
            <div className="performance-bar">
              <div className="performance-fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="performance-item">
            <div className="performance-label">Average Processing Time</div>
            <div className="performance-value">~15 seconds</div>
            <div className="performance-bar">
              <div className="performance-fill" style={{ width: '95%' }}></div>
            </div>
          </div>

          <div className="performance-item">
            <div className="performance-label">Cost Savings</div>
            <div className="performance-value">85%</div>
            <div className="performance-bar">
              <div className="performance-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="performance-item">
            <div className="performance-label">Employee Satisfaction</div>
            <div className="performance-value">98%</div>
            <div className="performance-bar">
              <div className="performance-fill" style={{ width: '98%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <div className="recommendation-list">
          <div className="recommendation-item">
            <div className="recommendation-icon">💰</div>
            <div className="recommendation-content">
              <h4>Optimize Contract Balance</h4>
              <p>Consider maintaining a balance of {(avgTransactionAmount * 2).toFixed(2)} SHM for smoother operations.</p>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="recommendation-icon">📅</div>
            <div className="recommendation-content">
              <h4>Schedule Regular Payrolls</h4>
              <p>Set up automated monthly payrolls to improve employee satisfaction and reduce manual work.</p>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="recommendation-icon">📊</div>
            <div className="recommendation-content">
              <h4>Track Expenses</h4>
              <p>Export transaction data regularly for accounting and tax compliance purposes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;