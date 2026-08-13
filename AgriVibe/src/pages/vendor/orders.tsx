import { useState, useEffect } from 'react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const response = await api.get('/orders/vendor');
      setOrders(response.data.orders || []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      setError(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status });
      await fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-500/30 text-green-300',
      'pending': 'bg-yellow-500/30 text-yellow-300',
      'processing': 'bg-blue-500/30 text-blue-300',
      'shipped': 'bg-purple-500/30 text-purple-300',
      'cancelled': 'bg-red-500/30 text-red-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="text-center text-gray-400 py-12">Loading orders...</div>
      </VendorLayout>
    );
  }

  if (error) {
    return (
      <VendorLayout>
        <div className="text-center text-red-400 py-12">{error}</div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">Manage your customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white">No Orders Yet</h3>
          <p className="text-gray-400 mt-2">Orders will appear here when customers buy from you</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Order ID</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Customer</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Date</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Total</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{order.order_number || order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.customer?.name || 'Customer'}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">KES {order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:border-yellow-400 outline-none transition"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VendorLayout>
  );
}