import React from 'react';

const PayrollPage = ({ 
  employees, 
  setEmployees, 
  shmPrice, 
  loading, 
  contractBalance,
  onDepositFunds, 
  onExecutePayroll 
}) => {
  const addEmployee = () => {
    setEmployees([...employees, { name: '', address: '', usdAmount: '' }]);
  };

  const removeEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const updateEmployee = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const calculateTotalUSD = () => {
    return employees.reduce((sum, emp) => sum + (parseFloat(emp.usdAmount) || 0), 0);
  };

  const calculateTotalSHM = () => {
    if (shmPrice === 0) return 0;
    return calculateTotalUSD() / shmPrice;
  };

  const validEmployees = employees.filter(emp => 
    emp.name && emp.address && emp.usdAmount && parseFloat(emp.usdAmount) > 0
  );

  return (
    <div className="payroll-page">
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        <p>Create and execute batch payments to your employees</p>
      </div>

      {/* Contract Status */}
      <div className="contract-status">
        <div className="status-item">
          <div className="status-label">Contract Balance</div>
          <div className="status-value">{parseFloat(contractBalance).toFixed(4)} SHM</div>
        </div>
        <div className="status-item">
          <div className="status-label">SHM Price</div>
          <div className="status-value">${shmPrice.toFixed(4)} USD</div>
        </div>
        <div className="status-item">
          <div className="status-label">Valid Employees</div>
          <div className="status-value">{validEmployees.length}</div>
        </div>
      </div>

      {/* Employee Management */}
      <div className="employee-section">
        <div className="section-header">
          <h2>Employee List</h2>
          <button className="add-employee-btn" onClick={addEmployee}>
            <span className="btn-icon">➕</span>
            Add Employee
          </button>
        </div>

        <div className="employee-list">
          {employees.map((employee, index) => (
            <div key={index} className="employee-card">
              <div className="employee-number">{index + 1}</div>
              
              <div className="employee-fields">
                <div className="field-group">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={employee.name}
                    onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                    className="employee-input"
                  />
                </div>

                <div className="field-group">
                  <label>Wallet Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={employee.address}
                    onChange={(e) => updateEmployee(index, 'address', e.target.value)}
                    className="employee-input address-input"
                  />
                </div>

                <div className="field-group">
                  <label>Salary (USD)</label>
                  <div className="salary-input-group">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="1000"
                      value={employee.usdAmount}
                      onChange={(e) => updateEmployee(index, 'usdAmount', e.target.value)}
                      className="employee-input salary-input"
                    />
                  </div>
                  {employee.usdAmount && (
                    <div className="shm-equivalent">
                      ≈ {(parseFloat(employee.usdAmount) / shmPrice).toFixed(4)} SHM
                    </div>
                  )}
                </div>
              </div>

              <button 
                className="remove-employee-btn"
                onClick={() => removeEmployee(index)}
                disabled={employees.length === 1}
                title="Remove Employee"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="payment-summary-section">
        <h2>Payment Summary</h2>
        <div className="summary-card">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Total Employees</div>
              <div className="summary-value">{validEmployees.length}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total USD</div>
              <div className="summary-value">${calculateTotalUSD().toFixed(2)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total SHM</div>
              <div className="summary-value">{calculateTotalSHM().toFixed(4)} SHM</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Contract Balance</div>
              <div className="summary-value">{parseFloat(contractBalance).toFixed(4)} SHM</div>
            </div>
          </div>

          {calculateTotalSHM() > parseFloat(contractBalance) && (
            <div className="insufficient-balance-warning">
              ⚠️ Insufficient contract balance. Please deposit more funds.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-btn deposit-btn"
          onClick={onDepositFunds}
          disabled={loading || calculateTotalSHM() === 0}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="btn-icon">💰</span>
              Deposit Funds
            </>
          )}
        </button>

        <button 
          className="action-btn execute-btn"
          onClick={onExecutePayroll}
          disabled={loading || validEmployees.length === 0 || calculateTotalSHM() > parseFloat(contractBalance)}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Execute Payroll
            </>
          )}
        </button>
      </div>

      {/* Employee Preview */}
      {validEmployees.length > 0 && (
        <div className="employee-preview">
          <h3>Payment Preview</h3>
          <div className="preview-list">
            {validEmployees.map((emp, index) => (
              <div key={index} className="preview-item">
                <div className="preview-employee">
                  <div className="employee-avatar">👤</div>
                  <div className="employee-details">
                    <div className="employee-name">{emp.name}</div>
                    <div className="employee-address">{emp.address.slice(0, 10)}...{emp.address.slice(-8)}</div>
                  </div>
                </div>
                <div className="preview-amount">
                  <div className="usd-amount">${parseFloat(emp.usdAmount).toFixed(2)}</div>
                  <div className="shm-amount">{(parseFloat(emp.usdAmount) / shmPrice).toFixed(4)} SHM</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;