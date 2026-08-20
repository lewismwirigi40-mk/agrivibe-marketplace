// src/pages/admin/users.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Phone,
  Shield,
  Clock,
  Trash2,
  Ban,
  UserCheck,
  UserX,
  Sparkles,
  Building,
  Star,
  Edit,
  Store,
  Truck
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      setError(error.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'block' : 'unblock'} this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/toggle`, { is_active: !currentStatus });
      await fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      await fetchUsers();
      setShowDeleteModal(null);
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'blocked' && !user.is_active);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.first_name || '').localeCompare(b.first_name || '');
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    blocked: users.filter(u => !u.is_active).length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    customers: users.filter(u => u.role === 'customer').length,
    drivers: users.filter(u => u.role === 'driver').length,
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-700 border-purple-200',
      'vendor': 'bg-green-100 text-green-700 border-green-200',
      'driver': 'bg-blue-100 text-blue-700 border-blue-200',
      'customer': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, any> = {
      'admin': Shield,
      'vendor': Store,
      'driver': Truck,
      'customer': User,
    };
    return icons[role?.toLowerCase()] || User;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 bg-agrivibe-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 mt-1">Manage all platform users</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <Users className="w-4 h-4" />
              {stats.total} Total Users
            </span>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: stats.active, icon: UserCheck, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Blocked', value: stats.blocked, icon: UserX, color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
            { label: 'Admins', value: stats.admins, icon: Shield, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
            { label: 'Vendors', value: stats.vendors, icon: Store, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Drivers', value: stats.drivers, icon: Truck, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
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
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="relative sm:w-44">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">🛡️ Admin</option>
                <option value="vendor">🏪 Vendor</option>
                <option value="driver">🚚 Driver</option>
                <option value="customer">👤 Customer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">✅ Active</option>
                <option value="blocked">🚫 Blocked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== USERS TABLE ====== */}
        {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No users found</h3>
            <p className="text-gray-500 text-lg">
              {search || roleFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No users registered yet'}
            </p>
            {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">User</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Email</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Role</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Status</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Joined</th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => {
                      const RoleIcon = getRoleIcon(user.role);
                      const roleColor = getRoleColor(user.role);
                      const isActive = user.is_active;
                      
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-agrivibe-green" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </p>
                                {user.phone && (
                                  <p className="text-xs text-gray-500">{user.phone}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${roleColor}`}>
                              <RoleIcon className="w-3.5 h-3.5" />
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                              isActive 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-red-100 text-red-700 border-red-200'
                            }`}>
                              {isActive ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              {isActive ? 'Active' : 'Blocked'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user.id, isActive)}
                                className={`p-2 transition-colors rounded-lg ${
                                  isActive 
                                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                }`}
                                title={isActive ? 'Block User' : 'Unblock User'}
                              >
                                {isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setShowDeleteModal(user.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ====== USER COUNT ====== */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====== USER DETAILS MODAL ====== */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">User Details</p>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </h4>
                    <p className="text-sm text-gray-900">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm text-gray-500">{selectedUser.phone}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Account Information
                    </h4>
                    <p className="text-sm text-gray-900">Role: <span className="font-medium">{selectedUser.role}</span></p>
                    <p className="text-sm text-gray-900">Status: <span className={`font-medium ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.is_active ? 'Active' : 'Blocked'}
                    </span></p>
                    <p className="text-sm text-gray-500">Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowUserModal(false)}
                  className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DELETE CONFIRMATION MODAL ====== */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete User?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  This will permanently delete this user and all their data. This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(showDeleteModal)}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}