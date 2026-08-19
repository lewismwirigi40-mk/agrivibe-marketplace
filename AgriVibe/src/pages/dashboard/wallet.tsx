import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-12">Loading wallet...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Wallet</h1>
          <p className="text-gray-400 mt-1">Manage your balance and transactions</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6">
          <p className="text-gray-900/70 text-sm">Available Balance</p>
          <p className="text-4xl font-bold text-gray-900">KES {balance.toLocaleString()}</p>
          <div className="flex gap-3 mt-4">
            <button className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition">
              + Add Funds
            </button>
            <button className="bg-gray-900/20 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-900/30 transition backdrop-blur-sm border border-white/20">
              Withdraw
            </button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
          <p className="text-gray-400 text-sm">Pending Clearance</p>
          <p className="text-3xl font-bold text-yellow-400">KES {pendingWithdrawal.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-2">⚠️ Funds held in escrow until delivery confirmed</p>
        </div>
      </div>

      {/* Quick Stats */}
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

      {/* Withdrawal Info */}
      <div className="mt-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
        <p className="text-gray-400 text-sm">
          💳 Funds will be sent to your registered payment method.
        </p>
      </div>
    </DashboardLayout>
  );
}