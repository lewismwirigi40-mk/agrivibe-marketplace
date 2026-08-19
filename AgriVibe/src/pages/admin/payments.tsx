import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformCommission: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/payments');
      setPayments(response.data.payments || []);
      // Calculate stats
      const total = response.data.payments?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;
      const pending = response.data.payments?.filter((p: any) => p.status === 'pending').length || 0;
      setStats({
        totalRevenue: total,
        platformCommission: total * 0.1,
        pendingPayments: pending,
      });
    } catch (error: any) {
      console.error('Failed to fetch payments:', error);
      setError(error.response?.data?.error || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-500/30 text-green-300',
      'pending': 'bg-yellow-500/30 text-yellow-300',
      'failed': 'bg-red-500/30 text-red-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading payments...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-400 py-12">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Payments</h1>
        <p className="text-gray-400 mt-1">View all platform payments and withdrawals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-xl font-bold text-white">KES {stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <div>
              <div className="text-xl font-bold text-yellow-400">KES {stats.platformCommission.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Platform Commission (10%)</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <div className="text-xl font-bold text-orange-400">{stats.pendingPayments}</div>
              <div className="text-sm text-gray-400">Pending Payments</div>
            </div>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-white">No payments found</h3>
          <p className="text-gray-400 mt-2">Payments will appear here when orders are completed</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Payment ID</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Order ID</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Vendor</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Amount</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Date</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{payment.id?.slice(0, 8) || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{payment.order_id || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{payment.vendor?.store_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">KES {payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <button className="text-green-400 hover:text-green-300 text-sm transition">
                          Approve
                        </button>
                      )}
                      {payment.status === 'completed' && (
                        <span className="text-gray-500 text-sm">✅ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}