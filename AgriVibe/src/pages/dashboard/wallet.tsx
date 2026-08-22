// src/pages/dashboard/wallet.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet as WalletIcon,  // ✅ Renamed to avoid conflict
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  History,
  DollarSign,
  PiggyBank,
  Lock,
  Send,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Copy,
  Gift
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/wallet/balance');
      const data = response.data;
      setBalance(data.balance || 0);
      setTotalEarned(data.total_earned || 0);
      setTotalWithdrawn(data.total_withdrawn || 0);
      setPendingWithdrawal(data.pending_withdrawal || 0);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      setWithdrawError('Insufficient balance');
      return;
    }

    setWithdrawing(true);
    setWithdrawError('');

    try {
      const response = await api.post('/wallet/withdraw', {
        amount: amount,
        payment_method: 'mpesa'
      });

      if (response.data.message) {
        setSuccessMessage('✅ Withdrawal request submitted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowWithdrawModal(false);
          setWithdrawAmount('');
          fetchWallet();
          fetchTransactions();
        }, 2000);
      }
    } catch (error: any) {
      setWithdrawError(error.response?.data?.error || 'Failed to process withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }

    setAdding(true);
    setWithdrawError('');

    try {
      const response = await api.post('/wallet/add-funds', {
        amount: amount,
        payment_method: 'mpesa'
      });

      if (response.data.message) {
        setSuccessMessage('✅ Funds added successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowAddFundsModal(false);
          setAddAmount('');
          fetchWallet();
          fetchTransactions();
        }, 2000);
      }
    } catch (error: any) {
      setWithdrawError(error.response?.data?.error || 'Failed to add funds');
    } finally {
      setAdding(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      'credit': TrendingUp,
      'debit': TrendingDown,
      'pending': Clock,
      'completed': CheckCircle,
      'failed': AlertCircle,
    };
    return icons[type?.toLowerCase()] || Clock;
  };

  const getTransactionColor = (type: string) => {
    const colors: Record<string, string> = {
      'credit': 'text-green-500 bg-green-50',
      'debit': 'text-red-500 bg-red-50',
      'pending': 'text-yellow-500 bg-yellow-50',
      'completed': 'text-green-500 bg-green-50',
      'failed': 'text-red-500 bg-red-50',
    };
    return colors[type?.toLowerCase()] || 'text-gray-500 bg-gray-50';
  };

  const filteredTransactions = selectedPeriod === 'all' 
    ? transactions 
    : transactions.filter((t: any) => {
        const date = new Date(t.created_at);
        const now = new Date();
        if (selectedPeriod === 'week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return date >= weekAgo;
        }
        if (selectedPeriod === 'month') {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return date >= monthAgo;
        }
        return true;
      });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading wallet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-500 mt-1">Manage your balance and transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddFundsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add Funds
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={balance <= 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-400/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== BALANCE CARDS ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Balance */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-500 to-teal-500 rounded-3xl p-8"
>
  <div className="absolute inset-0 bg-white/10" />
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
  
  <div className="relative">
    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
      <WalletIcon className="w-5 h-5" />  {/* ✅ Changed from Wallet to WalletIcon */}
      <span>Available Balance</span>
    </div>
    <p className="text-4xl md:text-5xl font-bold text-white">
      {formatCurrency(balance)}
    </p>
    <div className="flex gap-3 mt-6">
      <button
        onClick={() => setShowAddFundsModal(true)}
        className="bg-white text-agrivibe-green px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        + Add Funds
      </button>
      <button
        onClick={() => setShowWithdrawModal(true)}
        disabled={balance <= 0}
        className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Withdraw
      </button>
    </div>
  </div>
</motion.div>

          {/* Pending Clearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span>Pending Clearance</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-yellow-500">
              {formatCurrency(pendingWithdrawal)}
            </p>
            <div className="mt-4 flex items-start gap-2 bg-yellow-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                Funds held in escrow until delivery is confirmed
              </p>
            </div>
          </motion.div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Earned</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalEarned)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center"
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Withdrawn</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totalWithdrawn)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">Currency</p>
            <p className="text-xl font-bold text-gray-900">KES</p>
          </motion.div>
        </div>

        {/* ====== TRANSACTIONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-agrivibe-green" />
              <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
            </div>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-agrivibe-green outline-none transition-all cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredTransactions.map((transaction: any, index: number) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);
                  const isCredit = transaction.type === 'credit' || transaction.type === 'completed';
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description || transaction.type}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(transaction.created_at).toLocaleDateString()}
                            <span className="text-gray-300">•</span>
                            {new Date(transaction.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                          {isCredit ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{transaction.status || 'completed'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ====== SECURITY NOTE ====== */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                💳 All transactions are securely processed and encrypted.
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Funds are held in escrow until delivery is confirmed by the customer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== WITHDRAW MODAL ====== */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
                      <p className="text-gray-800/70 text-sm">Request a withdrawal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-2xl font-bold text-agrivibe-green">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setWithdrawAmount(balance.toString())}
                      className="text-xs text-agrivibe-green hover:underline font-medium mt-1"
                    >
                      Withdraw All
                    </button>
                  </div>

                  {withdrawError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{withdrawError}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleWithdraw}
                      disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {withdrawing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Withdraw
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== ADD FUNDS MODAL ====== */}
      <AnimatePresence>
        {showAddFundsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add Funds</h2>
                      <p className="text-white/80 text-sm">Deposit money into your wallet</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddFundsModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="text-2xl font-bold text-agrivibe-green">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setAddAmount(amount.toString())}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        KES {amount}
                      </button>
                    ))}
                  </div>

                  {withdrawError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{withdrawError}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddFundsModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFunds}
                      disabled={adding || !addAmount || parseFloat(addAmount) <= 0}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {adding ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Funds
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}