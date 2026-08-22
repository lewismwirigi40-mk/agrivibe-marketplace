// src/pages/checkout.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Truck,
  Wallet,
  Smartphone,
  Shield,
  Sparkles,
  Clock,
  Package,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    county: '',
    phone: '',
    paymentMethod: 'mpesa',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await api.get('/cart');
      const items = response.data.items || [];
      setCartItems(items);
      const sub = response.data.subtotal || 0;
      setSubtotal(sub);
      const fee = sub > 1000 ? 0 : 150;
      setDeliveryFee(fee);
      setTotal(sub + fee);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/orders/checkout', {
        delivery_address: `${formData.address}, ${formData.city}, ${formData.county}`,
        delivery_notes: formData.notes,
        payment_method: formData.paymentMethod,
      });
      alert('✅ Order placed successfully!');
      router.push('/dashboard/orders');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: 'Delivery', icon: MapPin },
    { number: 2, label: 'Payment', icon: CreditCard },
    { number: 3, label: 'Confirm', icon: CheckCircle },
  ];

  const paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa', icon: Smartphone, description: 'Pay with M-Pesa' },
    { value: 'card', label: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
    { value: 'wallet', label: 'Wallet', icon: Wallet, description: 'Use wallet balance' },
  ];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-premium-light overflow-x-hidden">
      {/* ====== HEADER ====== */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container-premium py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-xs text-gray-500">Complete your order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>{cartItems.length} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        {/* ====== STEPS ====== */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isCompleted = step > s.number;
            
            return (
              <div key={s.number} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                    ${isActive ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30 scale-110' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                  `}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : s.number}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-agrivibe-green' : 'text-gray-500'}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div className={`w-8 md:w-16 h-0.5 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== MAIN FORM ====== */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Delivery */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                        <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Street Address *
                      </label>
                      <input
                        name="address"
                        placeholder="e.g., 123 Main Street"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          City *
                        </label>
                        <input
                          name="city"
                          placeholder="e.g., Nairobi"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          County *
                        </label>
                        <input
                          name="county"
                          placeholder="e.g., Kiambu"
                          value={formData.county}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        name="phone"
                        placeholder="e.g., 254700000000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                        <p className="text-sm text-gray-500">Choose how you want to pay</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = formData.paymentMethod === method.value;
                        return (
                          <label
                            key={method.value}
                            className={`
                              flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                              ${isSelected 
                                ? 'border-agrivibe-green bg-agrivibe-green/5 shadow-lg shadow-agrivibe-green/10' 
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={isSelected}
                              onChange={handleChange}
                              className="w-4 h-4 text-agrivibe-green focus:ring-agrivibe-green"
                            />
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-agrivibe-green text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold ${isSelected ? 'text-agrivibe-green' : 'text-gray-900'}`}>
                                {method.label}
                              </p>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-agrivibe-green" />
                            )}
                          </label>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Any special instructions for delivery..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                      >
                        Review Order
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Confirm Order</h2>
                        <p className="text-sm text-gray-500">Review your order before placing</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Items</span>
                        <span className="font-medium text-gray-900">{cartItems.length}</span>
                      </div>
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
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-agrivibe-green">KES {total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">
                          {formData.address}, {formData.city}, {formData.county}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 capitalize">{formData.paymentMethod}</span>
                      </div>
                      {formData.notes && (
                        <div className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{formData.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3.5 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                            Placing...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            Place Order
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ====== ORDER SUMMARY ====== */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-agrivibe-green" />
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-50">
                    <span className="text-gray-600">
                      {item.Product?.name || 'Product'} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">KES {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">KES {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-agrivibe-green">KES {total}</span>
                  </div>
                </div>
              </div>

              {deliveryFee === 0 && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded-xl">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery on orders over KES 1,000</span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Secure checkout • Encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}