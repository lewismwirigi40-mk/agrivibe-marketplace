import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/vendors');
      setVendors(response.data.vendors || []);
    } catch (error: any) {
      console.error('Failed to fetch vendors:', error);
      setError(error.response?.data?.error || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id: string) => {
    if (!confirm('Approve this vendor?')) return;
    try {
      await api.put(`/admin/vendors/${id}/approve`);
      await fetchVendors();
    } catch (error) {
      alert('Failed to approve vendor');
    }
  };

  const rejectVendor = async (id: string) => {
    if (!confirm('Reject this vendor?')) return;
    try {
      await api.put(`/admin/vendors/${id}/reject`);
      await fetchVendors();
    } catch (error) {
      alert('Failed to reject vendor');
    }
  };

  const deleteVendor = async (id: string) => {
    if (!confirm('Delete this vendor?')) return;
    try {
      await api.delete(`/admin/vendors/${id}`);
      await fetchVendors();
    } catch (error) {
      alert('Failed to delete vendor');
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.store_name?.toLowerCase().includes(search.toLowerCase()) ||
                          vendor.vendor?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                          vendor.vendor?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? (filter === 'approved' ? vendor.is_approved : !vendor.is_approved) : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading vendors...</div>
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
          <h1 className="text-3xl font-bold text-white">Vendors</h1>
          <p className="text-gray-400 mt-1">Manage all vendor stores</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Pending: {vendors.filter(v => !v.is_approved).length} | Approved: {vendors.filter(v => v.is_approved).length}
      </div>

      {filteredVendors.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-white">No vendors found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Store</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Owner</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Email</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Products</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Joined</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{vendor.store_name}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {vendor.vendor?.first_name} {vendor.vendor?.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{vendor.vendor?.email}</td>
                    <td className="px-6 py-4 text-gray-300">{vendor.total_products || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vendor.is_approved ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'
                      }`}>
                        {vendor.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {!vendor.is_approved ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveVendor(vendor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectVendor(vendor.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => deleteVendor(vendor.id)}
                          className="text-red-400 hover:text-red-300 text-sm transition"
                        >
                          Delete
                        </button>
                      )}
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