import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">🌾 Marketplace</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center text-6xl">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-3">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.store?.store_name || 'Vendor'}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-yellow-400 font-bold">KES {product.price}</span>
                    <span className="text-gray-400 text-xs">⭐ {product.rating || 0}</span>
                  </div>
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-400 text-xs">In Stock</span>
                  ) : (
                    <span className="text-red-400 text-xs">Out of Stock</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}