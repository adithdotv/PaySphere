import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PayrollPage from './components/PayrollPage';
import HistoryPage from './components/HistoryPage';
import AnalyticsPage from './components/AnalyticsPage';

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
  rpcUrls: ['https://api-unstable.shardeum.org'],
  blockExplorerUrls: ['https://explorer-unstable.shardeum.org/'],
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
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
      fetchTransactionHistory();
    }
  }, [contract, provider]);

  const fetchSHMPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=shardeum&vs_currencies=usd');
      console.log(response.data)
      const ethPrice = response.data.shardeum.usd;
      setShmPrice(ethPrice);
    } catch (error) {
      console.error('Error fetching price:', error);
      setShmPrice(0.05);
    }
  };

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask is not installed! Please install MetaMask extension.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Simple connection approach
      console.log('Connecting to MetaMask...');

      // Request accounts with a simpler approach
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please unlock MetaMask.');
        return;
      }

      console.log('Connected account:', accounts[0]);

      // Initialize provider without network switching first
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get current network
      const network = await provider.getNetwork();
      console.log('Current network:', network.chainId.toString());

      // Check if we're on Shardeum network
      if (network.chainId.toString() !== '8081') {
        toast.info('Please switch to Shardeum network manually in MetaMask');

        // Try to add/switch network (optional)
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1F90',
              chainName: 'Shardeum Unstablenet',
              nativeCurrency: {
                name: 'SHM',
                symbol: 'SHM',
                decimals: 18,
              },
              rpcUrls: ['https://api-unstable.shardeum.org/'],
              blockExplorerUrls: ['https://explorer-unstable.shardeum.org/'],
            }],
          });
        } catch (networkError) {
          console.log('Network add failed, continuing anyway:', networkError);
        }
      }

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Set state
      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);

      toast.success(`Wallet connected! ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);

    } catch (error) {
      console.error('Connection error:', error);

      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else if (error.code === -32002) {
        toast.error('Connection request pending. Check MetaMask popup.');
      } else {
        toast.error('Failed to connect. Please refresh and try again.');
      }
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

  const fetchTransactionHistory = async () => {
    try {
      console.log('Fetching transaction history from blockchain...');

      // Get current block number
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Look back 10000 blocks

      console.log(`Searching from block ${fromBlock} to ${currentBlock}`);

      // Fetch PaymentDisbursed events
      const paymentFilter = contract.filters.PaymentDisbursed();
      const paymentEvents = await contract.queryFilter(paymentFilter, fromBlock, currentBlock);

      // Fetch FundsDeposited events
      const depositFilter = contract.filters.FundsDeposited();
      const depositEvents = await contract.queryFilter(depositFilter, fromBlock, currentBlock);

      console.log('Payment events found:', paymentEvents.length);
      console.log('Deposit events found:', depositEvents.length);

      const allTransactions = [];

      // Process payment events
      for (const event of paymentEvents) {
        try {
          const block = await provider.getBlock(event.blockNumber);
          const totalAmount = event.args.amounts.reduce((sum, amount) => sum + amount, 0n);

          allTransactions.push({
            type: 'Payroll',
            recipients: event.args.recipients.length,
            totalAmount: parseFloat(ethers.formatEther(totalAmount)),
            timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
            hash: event.transactionHash,
            blockNumber: event.blockNumber
          });
        } catch (eventError) {
          console.error('Error processing payment event:', eventError);
        }
      }

      // Process deposit events
      for (const event of depositEvents) {
        try {
          const block = await provider.getBlock(event.blockNumber);

          allTransactions.push({
            type: 'Deposit',
            recipients: 1,
            totalAmount: parseFloat(ethers.formatEther(event.args.amount)),
            timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
            hash: event.transactionHash,
            blockNumber: event.blockNumber
          });
        } catch (eventError) {
          console.error('Error processing deposit event:', eventError);
        }
      }

      // Sort by block number (newest first)
      allTransactions.sort((a, b) => b.blockNumber - a.blockNumber);

      console.log('Total transactions loaded:', allTransactions.length);
      setTransactions(allTransactions);

      if (allTransactions.length > 0) {
        toast.success(`Loaded ${allTransactions.length} transactions from blockchain`);
      }

    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history from blockchain');
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
    setLoading(true);

    try {
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

      console.log('Transaction hash:', tx.hash);

      // Show success immediately after transaction is sent
      toast.success(`Deposit transaction successful! Hash: ${tx.hash.slice(0, 10)}...`);

      // Update balance in background without waiting
      setTimeout(() => {
        fetchContractBalance();
      }, 3000); // Wait 3 seconds then refresh balance

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
    setLoading(true);

    try {
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

      console.log('Transaction hash:', tx.hash);

      // Show success immediately after transaction is sent
      const transaction = {
        type: 'Payroll',
        recipients: validEmployees.length,
        totalAmount: calculateTotalSHM(),
        timestamp: new Date().toLocaleString(),
        hash: tx.hash
      };

      setTransactions(prev => [transaction, ...prev]);
      toast.success(`Payroll transaction successful! Paid ${validEmployees.length} employees. Hash: ${tx.hash.slice(0, 10)}...`);

      setEmployees([{ name: '', address: '', usdAmount: '' }]);

      // Update balance in background without waiting
      setTimeout(() => {
        fetchContractBalance();
      }, 3000); // Wait 3 seconds then refresh balance

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page !== 'landing' && !account) {
      connectWallet();
    }
  };

  const handleGetStarted = () => {
    if (account) {
      setCurrentPage('dashboard');
    } else {
      connectWallet();
      setCurrentPage('dashboard');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'dashboard':
        return (
          <Dashboard
            contractBalance={contractBalance}
            shmPrice={shmPrice}
            transactions={transactions}
            onPageChange={handlePageChange}
          />
        );
      case 'payroll':
        return (
          <PayrollPage
            employees={employees}
            setEmployees={setEmployees}
            shmPrice={shmPrice}
            loading={loading}
            contractBalance={contractBalance}
            onDepositFunds={depositFunds}
            onExecutePayroll={executePayroll}
          />
        );
      case 'history':
        return <HistoryPage transactions={transactions} shmPrice={shmPrice} />;
      case 'analytics':
        return (
          <AnalyticsPage
            transactions={transactions}
            shmPrice={shmPrice}
            contractBalance={contractBalance}
          />
        );
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== 'landing' && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          account={account}
          onConnectWallet={connectWallet}
        />
      )}

      <main className={`main-content ${currentPage === 'landing' ? 'landing' : ''}`}>
        {renderCurrentPage()}
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;