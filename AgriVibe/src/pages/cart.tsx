// src/pages/cart.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  Sparkles,
  Package,
  X,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setRemovingId(id);
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    } finally {
      setRemovingId(null);
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-premium-light">
        <div className="container-premium pt-28 pb-16">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-premium-light overflow-x-hidden">
      {/* ====== HEADER ====== */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container-premium py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/marketplace" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-xs text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors px-4 py-2 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        {cartItems.length === 0 ? (
          /* ====== EMPTY CART ====== */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 text-lg mb-8">Start shopping to add items to your cart</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          /* ====== CART WITH ITEMS ====== */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ====== CART ITEMS ====== */}
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.Product?.images?.[0] ? (
                          <img
                            src={item.Product.images[0]}
                            alt={item.Product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.Product?.name || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {item.Product?.store?.store_name || 'Vendor'}
                        </p>
                        <p className="text-lg font-bold text-agrivibe-green">
                          KES {item.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-agrivibe-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-agrivibe-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={removingId === item.id}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        {removingId === item.id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Subtotal per item */}
                    <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
                      <span className="text-xs text-gray-400">
                        Subtotal: KES {item.price * item.quantity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 text-agrivibe-green hover:text-emerald-600 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>

            {/* ====== ORDER SUMMARY ====== */}
            <div className="lg:w-96 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-agrivibe-green" />
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">KES {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}
                    </span>
                  </div>

                  {subtotal > 1000 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Free delivery applied!</span>
                    </motion.div>
                  )}

                  {subtotal > 0 && subtotal <= 1000 && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      <span>Add KES {1000 - subtotal} more for free delivery</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900 text-lg">Total</span>
                      <span className="text-2xl font-bold text-agrivibe-green">KES {total}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>

                  {/* Trust Badges */}
                  <div className="flex justify-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-agrivibe-green" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-agrivibe-green" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-agrivibe-green" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}