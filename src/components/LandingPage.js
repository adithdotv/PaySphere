import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              PaySphere
              <span className="gradient-text">Decentralized Global Payroll</span>
            </h1>
            <p className="hero-subtitle">
              Revolutionary payroll platform on Shardeum blockchain. Pay employees globally with instant, 
              low-cost, and transparent cryptocurrency transactions.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">3-5 Days</span>
                <span className="stat-label">Traditional Payroll Delay</span>
              </div>
              <div className="stat">
                <span className="stat-number">5-20%</span>
                <span className="stat-label">Traditional Fees</span>
              </div>
              <div className="stat">
                <span className="stat-number">Instant</span>
                <span className="stat-label">PaySphere Payments</span>
              </div>
            </div>
            <button className="cta-button" onClick={onGetStarted}>
              Get Started Now
              <span className="button-arrow">→</span>
            </button>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-title">Global Payroll</div>
                <div className="card-status">✓ Active</div>
              </div>
              <div className="card-content">
                <div className="employee-row">
                  <div className="employee-info">
                    <div className="employee-avatar">👨‍💻</div>
                    <div>
                      <div className="employee-name">John Doe</div>
                      <div className="employee-location">🇺🇸 New York</div>
                    </div>
                  </div>
                  <div className="employee-salary">$5,000</div>
                </div>
                <div className="employee-row">
                  <div className="employee-info">
                    <div className="employee-avatar">👩‍💼</div>
                    <div>
                      <div className="employee-name">Maria Silva</div>
                      <div className="employee-location">🇧🇷 São Paulo</div>
                    </div>
                  </div>
                  <div className="employee-salary">$3,500</div>
                </div>
                <div className="employee-row">
                  <div className="employee-info">
                    <div className="employee-avatar">👨‍🎨</div>
                    <div>
                      <div className="employee-name">Raj Patel</div>
                      <div className="employee-location">🇮🇳 Mumbai</div>
                    </div>
                  </div>
                  <div className="employee-salary">$2,800</div>
                </div>
              </div>
              <div className="card-footer">
                <div className="total-amount">Total: $11,300</div>
                <div className="pay-button">Pay All →</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose PaySphere?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Payments</h3>
              <p>Send payments to employees worldwide in seconds, not days. No more waiting for bank transfers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Low Fees</h3>
              <p>Minimal transaction costs on Shardeum blockchain. Save up to 95% compared to traditional methods.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Full Transparency</h3>
              <p>Every transaction is recorded on-chain. Complete audit trail for compliance and accountability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Reach</h3>
              <p>Pay employees anywhere in the world. No geographical restrictions or complex banking requirements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Self-Custodial</h3>
              <p>Employees receive funds directly in their wallets. No intermediaries, complete financial control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Batch Processing</h3>
              <p>Pay multiple employees in a single transaction. Efficient and cost-effective payroll management.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect Wallet</h3>
                <p>Connect your MetaMask wallet to the Shardeum network</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Add Employees</h3>
                <p>Input employee details and salary amounts in USD</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Deposit Funds</h3>
                <p>Fund your payroll contract with SHM tokens</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Execute Payroll</h3>
                <p>Send payments to all employees in one transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Revolutionize Your Payroll?</h2>
            <p>Join the future of global payments with PaySphere on Shardeum</p>
            <button className="cta-button secondary" onClick={onGetStarted}>
              Launch PaySphere
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;