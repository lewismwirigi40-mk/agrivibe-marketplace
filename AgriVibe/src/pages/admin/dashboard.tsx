import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await api.get('/admin/dashboard');
      setStats(statsResponse.data.stats);

      // Fetch analytics data
      const analyticsResponse = await api.get('/admin/analytics');
      const data = analyticsResponse.data;

      // Set chart data
      if (data.revenue) {
        setRevenueData(data.revenue);
      } else {
        // Fallback sample data if no real data
        setRevenueData([
          { month: 'Jan', revenue: 0 },
          { month: 'Feb', revenue: 0 },
          { month: 'Mar', revenue: 0 },
          { month: 'Apr', revenue: 0 },
          { month: 'May', revenue: 0 },
          { month: 'Jun', revenue: 0 },
          { month: 'Jul', revenue: 0 },
          { month: 'Aug', revenue: 0 },
        ]);
      }

      if (data.userGrowth) {
        setUserGrowthData(data.userGrowth);
      } else {
        setUserGrowthData([
          { month: 'Jan', users: 0 },
          { month: 'Feb', users: 0 },
          { month: 'Mar', users: 0 },
          { month: 'Apr', users: 0 },
          { month: 'May', users: 0 },
          { month: 'Jun', users: 0 },
          { month: 'Jul', users: 0 },
          { month: 'Aug', users: 0 },
        ]);
      }

      if (data.orderStatus) {
        setOrderStatusData(data.orderStatus);
      } else {
        setOrderStatusData([
          { name: 'Delivered', value: 0 },
          { name: 'Processing', value: 0 },
          { name: 'Pending', value: 0 },
          { name: 'Cancelled', value: 0 },
        ]);
      }

    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard');
      // Set fallback data on error
      setRevenueData([
        { month: 'Jan', revenue: 0 },
        { month: 'Feb', revenue: 0 },
        { month: 'Mar', revenue: 0 },
        { month: 'Apr', revenue: 0 },
        { month: 'May', revenue: 0 },
        { month: 'Jun', revenue: 0 },
        { month: 'Jul', revenue: 0 },
        { month: 'Aug', revenue: 0 },
      ]);
      setUserGrowthData([
        { month: 'Jan', users: 0 },
        { month: 'Feb', users: 0 },
        { month: 'Mar', users: 0 },
        { month: 'Apr', users: 0 },
        { month: 'May', users: 0 },
        { month: 'Jun', users: 0 },
        { month: 'Jul', users: 0 },
        { month: 'Aug', users: 0 },
      ]);
      setOrderStatusData([
        { name: 'Delivered', value: 0 },
        { name: 'Processing', value: 0 },
        { name: 'Pending', value: 0 },
        { name: 'Cancelled', value: 0 },
      ]);
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

  const COLORS = ['#2d7d2d', '#f5a623', '#2196f3', '#f44336'];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'bg-blue-500/20 border-blue-500/30' },
    { label: 'Vendors', value: stats.totalVendors || 0, icon: '🏪', color: 'bg-green-500/20 border-green-500/30' },
    { label: 'Drivers', value: stats.totalDrivers || 0, icon: '🚚', color: 'bg-purple-500/20 border-purple-500/30' },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: '👤', color: 'bg-yellow-500/20 border-yellow-500/30' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: '📦', color: 'bg-indigo-500/20 border-indigo-500/30' },
    { label: 'Total Revenue', value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-green-500/20 border-green-500/30' },
    { label: 'Platform Wallet', value: `KES ${(stats.platformWallet || 0).toLocaleString()}`, icon: '🏦', color: 'bg-yellow-500/20 border-yellow-500/30' },
    { label: 'Pending Approvals', value: (stats.pendingVendors || 0) + (stats.pendingProducts || 0), icon: '⏳', color: 'bg-red-500/20 border-red-500/30' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl px-4 py-2">
            <span className="text-yellow-400 font-semibold">⚠️ {stats.pendingVendors || 0} Pending Vendors</span>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2">
            <span className="text-blue-400 font-semibold">📦 {stats.pendingProducts || 0} Pending Products</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-2xl p-4 backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-300">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Revenue Chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Area type="monotone" dataKey="revenue" stroke="#f5a623" fill="#f5a62333" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Bar dataKey="users" fill="#2d7d2d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🥧 Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderStatusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 p-3 rounded-xl transition text-left">
              📋 Review Pending Vendors ({stats.pendingVendors || 0})
            </button>
            <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl transition text-left">
              📦 Approve Pending Products ({stats.pendingProducts || 0})
            </button>
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 p-3 rounded-xl transition text-left">
              💰 View Platform Wallet (KES {(stats.platformWallet || 0).toLocaleString()})
            </button>
            <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 p-3 rounded-xl transition text-left">
              📊 Generate Full Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}