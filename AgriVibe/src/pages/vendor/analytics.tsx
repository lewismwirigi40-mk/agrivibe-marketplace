import VendorLayout from '../../components/VendorLayout';
import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts';

export default function VendorAnalytics() {
  const [timeframe, setTimeframe] = useState('week');

  // Sample Data
  const dailySales = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1800 },
    { day: 'Wed', sales: 2500 },
    { day: 'Thu', sales: 2100 },
    { day: 'Fri', sales: 3200 },
    { day: 'Sat', sales: 2800 },
    { day: 'Sun', sales: 1500 },
  ];

  const revenueTrend = [
    { date: 'Aug 1', revenue: 2000 },
    { date: 'Aug 2', revenue: 3500 },
    { date: 'Aug 3', revenue: 2800 },
    { date: 'Aug 4', revenue: 4200 },
    { date: 'Aug 5', revenue: 3800 },
    { date: 'Aug 6', revenue: 5100 },
    { date: 'Aug 7', revenue: 4500 },
  ];

  const salesByCategory = [
    { name: 'Vegetables', value: 4500 },
    { name: 'Fruits', value: 3200 },
    { name: 'Meat', value: 2100 },
    { name: 'Dairy', value: 1800 },
    { name: 'Bakery', value: 1200 },
  ];

  const COLORS = ['#f5a623', '#2d7d2d', '#f44336', '#2196f3', '#9c27b0'];

  return (
    <VendorLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your store performance</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                timeframe === t
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Revenue', value: 'KES 12,450', change: '+15%', icon: '💰' },
          { label: 'Orders', value: '45', change: '+8%', icon: '📦' },
          { label: 'New Customers', value: '12', change: '+22%', icon: '👤' },
          { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: '📈' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Line Chart - Revenue Trend */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Line type="monotone" dataKey="revenue" stroke="#f5a623" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Sales by Category */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🥧 Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={salesByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Daily Sales */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Daily Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Bar dataKey="sales" fill="#2d7d2d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart - Order Volume */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📉 Order Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Area type="monotone" dataKey="revenue" stroke="#f5a623" fill="#f5a62333" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white">🏆 Top Selling Products</h2>
        <div className="mt-4 space-y-3">
          {[
            { name: 'Fresh Tomatoes', sales: 245, revenue: 'KES 36,750', trend: '⬆️' },
            { name: 'Organic Kale', sales: 180, revenue: 'KES 14,400', trend: '⬆️' },
            { name: 'Sweet Avocado', sales: 120, revenue: 'KES 14,400', trend: '➡️' },
          ].map((product, i) => (
            <div key={i} className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
              <div>
                <span className="text-white font-medium">{i + 1}. {product.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-300">{product.sales} sold</span>
                <span className="text-white font-semibold">{product.revenue}</span>
                <span className="text-lg">{product.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VendorLayout>
  );
}