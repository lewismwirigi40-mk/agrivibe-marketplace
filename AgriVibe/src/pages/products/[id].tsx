import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import PremiumButton from '../../components/PremiumButton';
import api from '../../services/api';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setAdding(true);
    try {
      await api.post('/cart/add', {
        product_id: id,
        quantity: quantity
      });
      alert('✅ Added to cart!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="pt-24 px-4 text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Product not found</h1>
          <Link href="/marketplace" className="text-yellow-400 hover:text-yellow-300 transition">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-6xl mx-auto pb-16">
        <Link href="/marketplace" className="text-yellow-400 hover:text-yellow-300 transition">
          ← Back to Marketplace
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-96 object-cover rounded-xl" />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center text-8xl">
                📦
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-gray-400 text-sm mt-1">By: {product.store?.store_name || 'Vendor'}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <span className="text-3xl font-bold text-yellow-400">KES {product.price}</span>
              <span className="text-gray-400">⭐ {product.rating || 0}</span>
            </div>

            <p className="text-gray-300 mt-4">{product.description || 'No description available.'}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-gray-400">Stock:</span>
              {product.stock_quantity > 0 ? (
                <span className="text-green-400 font-semibold">{product.stock_quantity} available</span>
              ) : (
                <span className="text-red-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-gray-300">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg transition"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-6">
              <PremiumButton
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={adding || product.stock_quantity <= 0}
              >
                {adding ? 'Adding...' : product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}