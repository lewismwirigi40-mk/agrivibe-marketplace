import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/products');
      setProducts(response.data.products || []);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      setError(error.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id: string) => {
    if (!confirm('Approve this product?')) return;
    try {
      await api.put(`/admin/products/${id}/approve`);
      await fetchProducts();
    } catch (error) {
      alert('Failed to approve product');
    }
  };

  const rejectProduct = async (id: string) => {
    if (!confirm('Reject this product?')) return;
    try {
      await api.put(`/admin/products/${id}/reject`);
      await fetchProducts();
    } catch (error) {
      alert('Failed to reject product');
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/products/${id}/toggle`, { is_active: !currentStatus });
      await fetchProducts();
    } catch (error) {
      alert('Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) ||
                          product.store?.store_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? product.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading products...</div>
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
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage all vendor products</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
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
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Pending: {products.filter(p => p.status === 'pending').length} | Approved: {products.filter(p => p.status === 'approved').length}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white">No products found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Product</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Vendor</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Price</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Added</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white">{product.name}</td>
                    <td className="px-6 py-4 text-gray-300">{product.store?.store_name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">KES {product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                        product.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-red-500/30 text-red-300'
                      }`}>
                        {product.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {product.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveProduct(product.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectProduct(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          className={`text-sm transition ${
                            product.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                          }`}
                        >
                          {product.is_active ? 'Deactivate' : 'Activate'}
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