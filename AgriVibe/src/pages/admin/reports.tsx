import AdminLayout from '../../components/AdminLayout';
import { useState, useRef } from 'react';
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

export default function AdminReports() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const printRef = useRef<HTMLDivElement>(null);

  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 170 },
    { month: 'May', revenue: 58000, orders: 160 },
    { month: 'Jun', revenue: 72000, orders: 200 },
    { month: 'Jul', revenue: 68000, orders: 185 },
    { month: 'Aug', revenue: 85000, orders: 230 },
  ];

  const categorySales = [
    { name: 'Vegetables', value: 35000 },
    { name: 'Fruits', value: 25000 },
    { name: 'Meat', value: 15000 },
    { name: 'Dairy', value: 12000 },
    { name: 'Bakery', value: 8000 },
  ];

  const COLORS = ['#2d7d2d', '#f5a623', '#f44336', '#2196f3', '#9c27b0'];

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AgriVibe Report</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #2d7d2d; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
                .chart-container { display: flex; justify-content: center; margin: 20px 0; }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">📄 Reports</h1>
          <p className="text-gray-400 mt-1">Generate and export platform reports</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
        >
          🖨️ Print Report
        </button>
      </div>

      {/* Report Controls */}
      <div className="flex flex-wrap gap-4 mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
          >
            <option value="revenue">Revenue Report</option>
            <option value="orders">Orders Report</option>
            <option value="users">Users Report</option>
            <option value="products">Products Report</option>
            <option value="payments">Payments Report</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition">
            Generate
          </button>
        </div>
      </div>

      {/* Report Content - Printable Area */}
      <div ref={printRef} className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        {/* Report Header */}
        <div className="text-center border-b border-white/10 pb-4">
          <div className="text-4xl mb-2">🌾</div>
          <h1 className="text-3xl font-bold text-white">AgriVibe</h1>
          <p className="text-gray-400">Platform Report - {currentDate}</p>
          <p className="text-gray-500 text-sm">Report Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Revenue', value: 'KES 489,000', icon: '💰' },
            { label: 'Total Orders', value: '1,340', icon: '📦' },
            { label: 'Active Users', value: '1,250', icon: '👥' },
            { label: 'Vendors', value: '85', icon: '🏪' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Area type="monotone" dataKey="revenue" stroke="#f5a623" fill="#f5a62333" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label fontSize={10}>
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">Transaction Data</h3>
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left text-gray-400 py-2 px-2">Order ID</th>
                <th className="text-left text-gray-400 py-2 px-2">Customer</th>
                <th className="text-left text-gray-400 py-2 px-2">Vendor</th>
                <th className="text-right text-gray-400 py-2 px-2">Amount</th>
                <th className="text-center text-gray-400 py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                { id: 'ORD-001', customer: 'Jane M.', vendor: 'Fresh Farm', amount: 'KES 450', status: 'Delivered' },
                { id: 'ORD-002', customer: 'Peter K.', vendor: 'Healthy Greens', amount: 'KES 320', status: 'Processing' },
                { id: 'ORD-003', customer: 'Mary W.', vendor: 'Avocado Paradise', amount: 'KES 780', status: 'Pending' },
              ].map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-2 px-2 text-white">{row.id}</td>
                  <td className="py-2 px-2">{row.customer}</td>
                  <td className="py-2 px-2">{row.vendor}</td>
                  <td className="py-2 px-2 text-right text-yellow-400">{row.amount}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      row.status === 'Delivered' ? 'bg-green-500/30 text-green-300' :
                      row.status === 'Pending' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-blue-500/30 text-blue-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs border-t border-white/10 pt-4 mt-6">
          <p>Report generated by AgriVibe Admin • {currentDate}</p>
          <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
        </div>
      </div>
    </AdminLayout>
  );
}