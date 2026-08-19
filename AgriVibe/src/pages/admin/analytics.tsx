import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid
} from 'recharts';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get(`/admin/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setError(error.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading analytics...</div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className="text-center text-red-400 py-12">{error || 'No data available'}</div>
      </AdminLayout>
    );
  }

  const COLORS = ['#2d7d2d', '#f5a623', '#f44336', '#2196f3', '#9c27b0'];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Platform performance and insights</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                period === t
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Revenue', value: `KES ${analytics.totalRevenue?.toLocaleString() || 0}`, change: '+12%', icon: '💰' },
          { label: 'Total Orders', value: analytics.totalOrders || 0, change: '+8%', icon: '📦' },
          { label: 'Active Users', value: analytics.activeUsers || 0, change: '+15%', icon: '👥' },
          { label: 'Conversion Rate', value: `${analytics.conversionRate || 0}%`, change: '+0.5%', icon: '📈' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
            </div>
            <div className="text-xl font-bold text-white mt-2">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {analytics.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.charts.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="label" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Line type="monotone" dataKey="value" stroke="#f5a623" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Sales by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.charts.categories || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(analytics.charts.categories || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📊 User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.charts.users || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="label" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Area type="monotone" dataKey="value" stroke="#f5a623" fill="#f5a62333" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📦 Order Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.charts.orders || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="label" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Bar dataKey="value" fill="#2d7d2d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}