import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PremiumButton from '../components/PremiumButton';
import api from '../services/api';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(true);
    try {
      await api.put(`/cart/${id}`, { quantity });
      await fetchCart();
    } catch (error) {
      alert('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm('Remove this item from cart?')) return;
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear your entire cart?')) return;
    try {
      await api.delete('/cart');
      await fetchCart();
    } catch (error) {
      alert('Failed to clear cart');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 1000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="pt-24 px-4 text-center text-gray-400">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">🛒 Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm transition">
              Clear Cart
            </button>
          )}
        </div>
        <p className="text-gray-400 mt-1">{cartItems.length} items in your cart</p>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
                <Link href="/marketplace" className="inline-block mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
                  Browse Products
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📦</div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.Product?.name || 'Product'}</h3>
                      <p className="text-yellow-400 font-bold">KES {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating}
                        className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg transition disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating}
                        className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg transition disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-96 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-fit">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>KES {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}</span>
                </div>
                {subtotal > 1000 && (
                  <div className="text-green-400 text-sm">✅ Free delivery applied!</div>
                )}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>KES {total}</span>
                  </div>
                </div>
                <Link href="/checkout" className="block w-full bg-yellow-400 text-gray-900 text-center py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
                  Proceed to Checkout
                </Link>
                <Link href="/marketplace" className="block w-full text-center text-gray-400 hover:text-white text-sm transition">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}