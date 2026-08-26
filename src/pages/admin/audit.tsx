// src/pages/admin/audit.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Search,
  Filter,
  ChevronDown,
  User,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Download,
  Printer
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // For now, use sample data until backend endpoint is ready
      setLogs([
        { id: 1, user: 'Super Admin', action: 'User logged in', details: 'admin@agrivibe.com', timestamp: '2026-08-26T10:30:00', type: 'login' },
        { id: 2, user: 'Super Admin', action: 'Updated settings', details: 'Site name changed to AgriVibe', timestamp: '2026-08-26T09:15:00', type: 'update' },
        { id: 3, user: 'Super Admin', action: 'Approved vendor', details: 'Fresh Farm Produce approved', timestamp: '2026-08-25T16:45:00', type: 'approve' },
        { id: 4, user: 'Super Admin', action: 'Deleted product', details: 'Product ID: PROD-123', timestamp: '2026-08-25T14:20:00', type: 'delete' },
        { id: 5, user: 'Super Admin', action: 'User created', details: 'New vendor account created', timestamp: '2026-08-25T11:00:00', type: 'create' },
      ]);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'login': 'bg-green-100 text-green-700 border-green-200',
      'update': 'bg-blue-100 text-blue-700 border-blue-200',
      'approve': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'delete': 'bg-red-100 text-red-700 border-red-200',
      'create': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'login': CheckCircle,
      'update': Activity,
      'approve': CheckCircle,
      'delete': XCircle,
      'create': CheckCircle,
    };
    return icons[type] || Activity;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading audit logs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-gray-500 mt-1">View all platform activity and changes</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* ====== STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: logs.length, icon: Activity, color: 'from-blue-500 to-blue-600' },
            { label: 'Today', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'from-green-500 to-emerald-500' },
            { label: 'This Week', value: logs.filter(l => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(l.timestamp) >= weekAgo;
            }).length, icon: Calendar, color: 'from-yellow-500 to-orange-500' },
            { label: 'Actions', value: logs.filter(l => l.type === 'update' || l.type === 'delete').length, icon: Shield, color: 'from-purple-500 to-purple-600' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by user, action, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="login">Login</option>
                <option value="update">Update</option>
                <option value="approve">Approve</option>
                <option value="delete">Delete</option>
                <option value="create">Create</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== LOGS TABLE ====== */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No logs found</h3>
            <p className="text-gray-500 text-lg">
              {search || filter !== 'all' ? 'Try adjusting your filters' : 'No audit logs available yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">User</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Action</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Details</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Type</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => {
                    const Icon = getTypeIcon(log.type);
                    const typeColor = getTypeColor(log.type);
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{log.action}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{log.details}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${typeColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {formatDate(log.timestamp)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}