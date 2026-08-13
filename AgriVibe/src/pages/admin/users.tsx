import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      await fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(search.toLowerCase()) ||
                          user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                          user.last_name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading users...</div>
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
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">Manage all platform users</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-white">No users found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Name</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Email</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Role</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Joined</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-purple-500/30 text-purple-300' :
                        user.role === 'vendor' ? 'bg-green-500/30 text-green-300' :
                        user.role === 'driver' ? 'bg-blue-500/30 text-blue-300' :
                        'bg-gray-500/30 text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                      }`}>
                        {user.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`text-sm transition mr-3 ${
                          user.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 text-sm transition"
                      >
                        Delete
                      </button>
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