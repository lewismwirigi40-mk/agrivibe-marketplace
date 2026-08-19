import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

    // ✅ CHECK IF VENDOR HAS PAYMENT DETAILS
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const storeResponse = await api.get('/stores/my-store');
      const store = storeResponse.data.store;

      // Check if payment details are set
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
        alert('✅ Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        await fetchWallet();
      }
    } catch (error: any) {
      setWithdrawError(error.response?.data?.error || 'Failed to process withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="text-center text-gray-400 py-12">Loading wallet...</div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400 mt-1">Manage your earnings and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6">
          <p className="text-gray-900/70 text-sm">Available Balance</p>
          <p className="text-4xl font-bold text-gray-900">KES {balance.toLocaleString()}</p>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={balance <= 0}
            className={`mt-4 bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition ${
              balance <= 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Withdraw
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
          <p className="text-gray-400 text-sm">Pending Clearance</p>
          <p className="text-3xl font-bold text-yellow-400">KES {pendingWithdrawal.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-2">⚠️ Funds held in escrow until delivery confirmed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Total Earned</p>
          <p className="text-xl font-bold text-green-400">KES {totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Total Withdrawn</p>
          <p className="text-xl font-bold text-red-400">KES {totalWithdrawn.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Currency</p>
          <p className="text-xl font-bold text-white">KES</p>
        </div>
      </div>

      <div className="mt-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
        <p className="text-gray-400 text-sm">
          💳 Funds will be sent to your registered payment method.
        </p>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-3xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 mb-2">Available Balance: <span className="text-yellow-400 font-bold">KES {balance.toLocaleString()}</span></p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
                <select
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                </select>
                <p className="text-gray-500 text-xs mt-1">
                  ⚠️ Please ensure your payment details are updated in Store Settings.
                </p>
              </div>

              {withdrawError && (
                <div className="bg-red-500/20 text-red-300 p-3 rounded-xl border border-red-500/30">
                  {withdrawError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
                >
                  {withdrawing ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}