import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading dashboard...</div>
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

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">No data available</div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'bg-blue-500/20 border-blue-500/30' },
    { label: 'Vendors', value: stats.totalVendors || 0, icon: '🏪', color: 'bg-green-500/20 border-green-500/30' },
    { label: 'Drivers', value: stats.totalDrivers || 0, icon: '🚚', color: 'bg-purple-500/20 border-purple-500/30' },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: '👤', color: 'bg-yellow-500/20 border-yellow-500/30' },
    { label: 'Orders', value: stats.totalOrders || 0, icon: '📦', color: 'bg-indigo-500/20 border-indigo-500/30' },
    { label: 'Revenue', value: `KES ${stats.totalRevenue || 0}`, icon: '💰', color: 'bg-green-500/20 border-green-500/30' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and key metrics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-2xl p-4 backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-300">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 p-3 rounded-xl transition text-left">
              📋 Review Pending Vendors
            </button>
            <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl transition text-left">
              📦 Approve Pending Products
            </button>
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 p-3 rounded-xl transition text-left">
              💰 View Platform Wallet
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Pending Vendors</span>
              <span className="text-yellow-400">{stats.pendingVendors || 0}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Pending Products</span>
              <span className="text-yellow-400">{stats.pendingProducts || 0}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Platform Wallet</span>
              <span className="text-green-400">KES {stats.platformWallet || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}