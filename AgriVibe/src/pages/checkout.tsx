import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import PremiumButton from '../components/PremiumButton';
import api from '../services/api';

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white">📦 Checkout</h1>
        <p className="text-gray-400 mt-1">Complete your order</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mt-6">
          {['Delivery', 'Payment', 'Confirm'].map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step > index ? 'bg-green-500 text-white' :
                step === index + 1 ? 'bg-yellow-400 text-gray-900' :
                'bg-white/10 text-gray-400'
              }`}>
                {step > index ? '✓' : index + 1}
              </div>
              <span className={`text-sm ${step === index + 1 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {label}
              </span>
              {index < 2 && <div className={`w-8 h-0.5 ${step > index ? 'bg-green-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">📍 Delivery Address</h2>
                  <input name="address" placeholder="Street Address *" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition" required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="city" placeholder="City *" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition" required />
                    <input name="county" placeholder="County *" value={formData.county} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition" required />
                  </div>
                  <input name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition" required />
                  <button type="button" onClick={() => setStep(2)} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">Continue →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">💳 Payment Method</h2>
                  <div className="space-y-2">
                    {['mpesa', 'card', 'wallet'].map((method) => (
                      <label key={method} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-yellow-400/50 transition">
                        <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="accent-yellow-400" />
                        <span className="text-white capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                  <textarea name="notes" rows={3} placeholder="Delivery notes..." value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">← Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">Review →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">✅ Confirm Order</h2>
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-gray-300"><span>Items</span><span>{cartItems.length}</span></div>
                    <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>KES {subtotal}</span></div>
                    <div className="flex justify-between text-gray-300"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}</span></div>
                    <div className="border-t border-white/10 pt-2"><div className="flex justify-between text-white font-bold text-lg"><span>Total</span><span>KES {total}</span></div></div>
                    <div className="text-gray-400 text-sm">📍 {formData.address}, {formData.city}</div>
                    <div className="text-gray-400 text-sm">💳 {formData.paymentMethod}</div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">← Back</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50">{loading ? 'Placing...' : 'Place Order'}</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="lg:w-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-fit">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-300 text-sm py-1">
                <span>{item.Product?.name || 'Product'} x{item.quantity}</span>
                <span>KES {item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-white/10 mt-3 pt-3">
              <div className="flex justify-between text-white font-bold"><span>Total</span><span>KES {total}</span></div>
            </div>
            {deliveryFee === 0 && <div className="text-green-400 text-sm mt-2">✅ Free delivery</div>}
          </div>
        </div>
      </div>
    </div>
  );
}