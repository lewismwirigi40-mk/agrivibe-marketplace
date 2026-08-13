import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // TODO: Replace with real wishlist endpoint when available
      // For now, using products as placeholder
      const response = await api.get('/products?limit=10');
      setWishlistItems(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    // TODO: Implement remove from wishlist
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-12">Loading wishlist...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <p className="text-gray-400 mt-1">Products you've saved for later</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="mt-6 text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-white">Your Wishlist is Empty</h3>
          <p className="text-gray-400 mt-2">Start adding products you love</p>
          <Link href="/marketplace" className="inline-block mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item: any) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="text-5xl">📦</div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  ❌
                </button>
              </div>
              <h3 className="text-lg font-semibold text-white mt-2">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.store?.store_name || 'Vendor'}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-yellow-400 font-bold">KES {item.price}</span>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}