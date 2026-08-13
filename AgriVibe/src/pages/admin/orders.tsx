import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

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
      const response = await api.get('/admin/orders');
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
      await api.put(`/admin/orders/${id}`, { status });
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                          order.store?.store_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? order.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading orders...</div>
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">View all platform orders</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Total Orders: {orders.length}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white">No orders found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Order ID</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Customer</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Vendor</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Total</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Date</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{order.order_number}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {order.customer?.first_name} {order.customer?.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{order.store?.store_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">KES {order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
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
        </div>
      )}
    </AdminLayout>
  );
}