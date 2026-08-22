// src/pages/vendor/wallet.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
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
  Send
} from 'lucide-react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorWallet() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWallet();
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

    // Check if vendor has payment details
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const storeResponse = await api.get('/stores/my-store');
      const store = storeResponse.data.store;

      const hasPaymentDetails = 
        (store.payment_method === 'mpesa' && store.mpesa_number) ||
        (store.payment_method === 'bank' && store.bank_name && store.bank_account);

      if (!hasPaymentDetails) {
        setWithdrawError('⚠️ Please set up your payment details in Store Settings first.');
        setTimeout(() => {
          setShowWithdrawModal(false);
          router.push('/vendor/settings');
        }, 2000);
        return;
      }
    } catch (error) {
      setWithdrawError('⚠️ Please set up your payment details in Store Settings first.');
      setTimeout(() => {
        setShowWithdrawModal(false);
        router.push('/vendor/settings');
      }, 2000);
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
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowWithdrawModal(false);
          setWithdrawAmount('');
          fetchWallet();
        }, 2000);
      }
    } catch (error: any) {
      setWithdrawError(error.response?.data?.error || 'Failed to process withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowWithdrawModal(false);
      }
    };
    if (showWithdrawModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWithdrawModal]);

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your wallet...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            <p className="text-gray-500 mt-1">Manage your earnings and withdrawals</p>
          </div>
          <button
            onClick={() => router.push('/vendor/wallet/transactions')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <History className="w-4 h-4" />
            Transaction History
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ====== MAIN BALANCE CARDS ====== */}
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
                <Wallet className="w-5 h-5" />
                <span>Available Balance</span>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white">
                KES {balance.toLocaleString()}
              </p>
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={balance <= 0}
                className={`mt-6 inline-flex items-center gap-2 bg-white text-agrivibe-green px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${
                  balance <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <Send className="w-4 h-4" />
                Withdraw Funds
              </button>
            </div>
          </motion.div>

          {/* Pending Clearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8"
          >
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span>Pending Clearance</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-yellow-500">
              KES {pendingWithdrawal.toLocaleString()}
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
            <p className="text-xl font-bold text-green-600">KES {totalEarned.toLocaleString()}</p>
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
            <p className="text-xl font-bold text-red-600">KES {totalWithdrawn.toLocaleString()}</p>
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

        {/* ====== INFO CARD ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                💳 Funds will be sent to your registered payment method. 
                <span className="text-blue-600 font-medium"> Update payment details</span> in your Store Settings.
              </p>
            </div>
          </div>
        </motion.div>
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
              <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
                      <p className="text-white/80 text-sm">Request a withdrawal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-2xl font-bold text-agrivibe-green">
                    KES {balance.toLocaleString()}
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
                    <div className="flex justify-end mt-1">
                      <button
                        onClick={() => setWithdrawAmount(balance.toString())}
                        className="text-xs text-agrivibe-green hover:underline font-medium"
                      >
                        Withdraw All
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all appearance-none"
                      >
                        <option value="mpesa">📱 M-Pesa</option>
                        <option value="bank">🏦 Bank Transfer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Ensure your payment details are updated in Store Settings
                    </p>
                  </div>

                  {withdrawError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
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
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {withdrawing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      {/* ====== SUCCESS TOAST ====== */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">✅ Withdrawal request submitted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== BACK TO TOP ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowRight className="w-5 h-5 -rotate-90" />
      </button>
    </VendorLayout>
  );
}

// Add missing imports
import { ChevronDown } from 'lucide-react';