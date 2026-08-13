import { useState, useEffect } from 'react';
import Link from 'next/link';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const response = await api.get('/products/vendor');
      setProducts(response.data.products || []);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      setError(error.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/products/${id}`, { is_active: !currentStatus });
      await fetchProducts();
    } catch (error) {
      alert('Failed to update product status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'approved': 'bg-green-500/30 text-green-300',
      'pending': 'bg-yellow-500/30 text-yellow-300',
      'rejected': 'bg-red-500/30 text-red-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="text-center text-gray-400 py-12">Loading products...</div>
      </VendorLayout>
    );
  }

  if (error) {
    return (
      <VendorLayout>
        <div className="text-center text-red-400 py-12">{error}</div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Products</h1>
          <p className="text-gray-400 mt-1">Manage your product listings</p>
        </div>
        <Link href="/vendor/products/add" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white">No Products Yet</h3>
          <p className="text-gray-400 mt-2">Start adding products to your store</p>
          <Link href="/vendor/products/add" className="inline-block mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Product</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Price</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Stock</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📦</span>
                      <span className="text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">KES {product.price}</td>
                  <td className="px-6 py-4 text-gray-300">{product.stock_quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status || 'pending')}`}>
                      {product.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/vendor/products/${product.id}/edit`} className="text-yellow-400 hover:text-yellow-300 text-sm transition mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                      className={`text-sm transition mr-3 ${
                        product.is_active ? 'text-gray-400 hover:text-red-400' : 'text-green-400 hover:text-green-300'
                      }`}
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-300 text-sm transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VendorLayout>
  );
}