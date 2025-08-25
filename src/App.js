import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CONTRACT_ADDRESS = '0xd526E17ebD9Cb6Ff3C6C8d845Fb28F276ba1fcb0';
const CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function deposit() payable",
  "function disperse(address[] calldata recipients, uint256[] calldata amounts) external",
  "function withdraw() external",
  "event PaymentDisbursed(address[] recipients, uint256[] amounts, uint256 timestamp)",
  "event FundsDeposited(address depositor, uint256 amount)"
];

const SHARDEUM_TESTNET = {
  chainId: '0x1F90',
  chainName: 'Shardeum Unstablenet',
  nativeCurrency: {
    name: 'SHM',
    symbol: 'SHM',
    decimals: 18,
  },
  rpcUrls: ['https://sphinx.shardeum.org/'],
  blockExplorerUrls: ['https://explorer-sphinx.shardeum.org/'],
};

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [employees, setEmployees] = useState([{ name: '', address: '', usdAmount: '' }]);
  const [shmPrice, setShmPrice] = useState(0.05);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [contractBalance, setContractBalance] = useState('0');

  useEffect(() => {
    fetchSHMPrice();
  }, []);

  useEffect(() => {
    if (contract && provider) {
      fetchContractBalance();
    }
  }, [contract, provider]);

  const fetchSHMPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const ethPrice = response.data.ethereum.usd;
      setShmPrice(ethPrice * 0.001);
    } catch (error) {
      console.error('Error fetching price:', error);
      setShmPrice(0.05);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SHARDEUM_TESTNET.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SHARDEUM_TESTNET],
          });
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const fetchContractBalance = async () => {
    try {
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching contract balance:', error);
    }
  };

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

  const depositFunds = async () => {
    try {
      setLoading(true);
      const totalSHM = calculateTotalSHM();

      if (totalSHM <= 0) {
        toast.error('Invalid amount to deposit');
        return;
      }

      const amountWei = ethers.parseEther(totalSHM.toFixed(18));

      console.log('Depositing:', totalSHM, 'SHM');
      console.log('Amount in wei:', amountWei.toString());

      // Check user balance first
      const userBalance = await provider.getBalance(account);
      if (userBalance < amountWei) {
        toast.error('Insufficient balance in your wallet');
        return;
      }

      toast.info('Initiating deposit transaction...');
      const tx = await contract.deposit({
        value: amountWei,
        gasLimit: 100000 // Set explicit gas limit
      });

      toast.info(`Transaction sent: ${tx.hash}`);
      console.log('Transaction hash:', tx.hash);

      // Wait for confirmation with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Transaction timeout')), 60000)
        )
      ]);

      console.log('Transaction confirmed:', receipt);
      toast.success('Funds deposited successfully!');
      fetchContractBalance();

    } catch (error) {
      console.error('Error depositing funds:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.message.includes('timeout')) {
        toast.error('Transaction timeout - check blockchain explorer');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds for gas');
      } else {
        toast.error(`Failed to deposit: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const executePayroll = async () => {
    try {
      setLoading(true);

      const validEmployees = employees.filter(emp =>
        emp.name && emp.address && emp.usdAmount && parseFloat(emp.usdAmount) > 0
      );

      if (validEmployees.length === 0) {
        toast.error('Please add at least one valid employee');
        return;
      }

      // Validate wallet addresses
      for (let emp of validEmployees) {
        if (!ethers.isAddress(emp.address)) {
          toast.error(`Invalid wallet address for ${emp.name}`);
          return;
        }
      }

      const recipients = validEmployees.map(emp => emp.address);
      const amounts = validEmployees.map(emp => {
        const shmAmount = parseFloat(emp.usdAmount) / shmPrice;
        return ethers.parseEther(shmAmount.toFixed(18));
      });

      const totalAmount = amounts.reduce((sum, amt) => sum + amt, 0n);

      console.log('Recipients:', recipients);
      console.log('Amounts in wei:', amounts.map(amt => amt.toString()));
      console.log('Amounts in SHM:', amounts.map(amt => ethers.formatEther(amt)));
      console.log('Total amount needed:', ethers.formatEther(totalAmount), 'SHM');

      // Check contract balance
      const contractBal = await provider.getBalance(CONTRACT_ADDRESS);
      if (contractBal < totalAmount) {
        toast.error('Insufficient contract balance. Please deposit funds first.');
        return;
      }

      toast.info('Initiating payroll transaction...');
      const tx = await contract.disperse(recipients, amounts, {
        gasLimit: 300000 + (validEmployees.length * 50000) // Dynamic gas limit
      });

      toast.info(`Transaction sent: ${tx.hash}`);
      console.log('Transaction hash:', tx.hash);

      // Wait for confirmation with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Transaction timeout')), 120000) // 2 minutes for payroll
        )
      ]);

      console.log('Transaction confirmed:', receipt);

      const transaction = {
        type: 'Payroll',
        recipients: validEmployees.length,
        totalAmount: calculateTotalSHM(),
        timestamp: new Date().toLocaleString(),
        hash: receipt.hash
      };

      setTransactions(prev => [transaction, ...prev]);
      toast.success(`Payroll executed successfully! Paid ${validEmployees.length} employees.`);

      setEmployees([{ name: '', address: '', usdAmount: '' }]);
      fetchContractBalance();

    } catch (error) {
      console.error('Error executing payroll:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.message.includes('timeout')) {
        toast.error('Transaction timeout - check blockchain explorer');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds for gas');
      } else if (error.message.includes('Not owner')) {
        toast.error('Only contract owner can execute payroll');
      } else if (error.message.includes('Insufficient balance')) {
        toast.error('Contract has insufficient balance');
      } else {
        toast.error(`Failed to execute payroll: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>PaySphere</h1>
        <p>Decentralized Global Payroll on Shardeum</p>
      </div>

      <div className="card">
        <div className="wallet-section">
          {!account ? (
            <button className="connect-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="connected-info">
              <p><strong>Connected:</strong> {account}</p>
              <p><strong>Contract Balance:</strong> {parseFloat(contractBalance).toFixed(4)} SHM</p>
              <p><strong>SHM Price:</strong> ${shmPrice.toFixed(4)} USD</p>
            </div>
          )}
        </div>
      </div>

      {account && (
        <>
          <div className="card">
            <h2>Employee Payroll</h2>
            <div className="employee-form">
              {employees.map((employee, index) => (
                <div key={index} className="form-row">
                  <div className="form-group">
                    <label>Employee Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={employee.name}
                      onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Wallet Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={employee.address}
                      onChange={(e) => updateEmployee(index, 'address', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary (USD)</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={employee.usdAmount}
                      onChange={(e) => updateEmployee(index, 'usdAmount', e.target.value)}
                    />
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeEmployee(index)}
                    disabled={employees.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button className="add-btn" onClick={addEmployee}>
                Add Employee
              </button>
            </div>

            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-row">
                <span>Total USD:</span>
                <span>${calculateTotalUSD().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total SHM:</span>
                <span>{calculateTotalSHM().toFixed(4)} SHM</span>
              </div>
              <div className="summary-row total">
                <span>Employees:</span>
                <span>{employees.filter(emp => emp.name && emp.address && emp.usdAmount).length}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                className="execute-btn"
                onClick={depositFunds}
                disabled={loading || calculateTotalSHM() === 0}
                style={{ flex: 1 }}
              >
                {loading ? <span className="loading"></span> : null}
                Deposit Funds
              </button>

              <button
                className="execute-btn"
                onClick={executePayroll}
                disabled={loading || calculateTotalSHM() === 0}
                style={{ flex: 1 }}
              >
                {loading ? <span className="loading"></span> : null}
                Execute Payroll
              </button>
            </div>
          </div>

          <div className="card">
            <h2>Transaction History</h2>
            <div className="transaction-history">
              {transactions.length === 0 ? (
                <p>No transactions yet</p>
              ) : (
                transactions.map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>{tx.type}</strong>
                      <span>{tx.timestamp}</span>
                    </div>
                    <div>Recipients: {tx.recipients} | Amount: {tx.totalAmount.toFixed(4)} SHM</div>
                    <div className="transaction-hash">Hash: {tx.hash}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;