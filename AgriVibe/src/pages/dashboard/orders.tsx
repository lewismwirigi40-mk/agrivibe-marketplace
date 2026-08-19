import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-500/30 text-green-300',
      'pending': 'bg-yellow-500/30 text-yellow-300',
      'processing': 'bg-blue-500/30 text-blue-300',
      'cancelled': 'bg-red-500/30 text-red-300',
      'shipped': 'bg-purple-500/30 text-purple-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">View all your orders and track status</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white">No Orders Yet</h3>
          <p className="text-gray-400 mt-2">Start shopping to see your orders here</p>
          <Link href="/marketplace" className="inline-block mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Order ID</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Date</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Total</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{order.order_number || order.id}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">KES {order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === 'paid' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}