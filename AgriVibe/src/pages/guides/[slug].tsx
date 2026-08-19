import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import PremiumButton from '../../components/PremiumButton';
import api from '../../services/api';

export default function GuideDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [downloadToken, setDownloadToken] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [error, setError] = useState('');
  const [purchaseId, setPurchaseId] = useState('');

  useEffect(() => {
    if (slug) {
      fetchGuide();
      checkPurchaseStatus();
    }
  }, [slug]);

  const fetchGuide = async () => {
    try {
      const response = await api.get(`/guides/${slug}`);
      setGuide(response.data.guide);
    } catch (error) {
      console.error('Failed to fetch guide:', error);
    } finally {
      setLoading(false);
    }
  };

const checkPurchaseStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Token exists?', !!token);
    if (!token) {
      console.log('No token, skipping purchase check');
      return;
    }
    
    console.log('🔍 Calling: /api/guides/my-guides');
    const response = await api.get('/guides/my-guides');
    console.log('✅ Response:', response.data);
    
    const purchases = response.data.purchases || [];
    const purchased = purchases.some((p: any) => p.guide?.slug === slug);
    setPurchased(purchased);
    if (purchased) {
      const guideData = purchases.find((p: any) => p.guide?.slug === slug);
      if (guideData) setDownloadToken(guideData.download_token);
    }
  } catch (error) {
    console.error('❌ Failed to check purchase status:', error);
  }
};
  const handlePaymentComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!purchaseId) {
        alert('❌ No purchase found. Please try again.');
        return;
      }

      const response = await api.post('/guides/confirm', {
        purchase_id: purchaseId,
        transaction_id: 'TXN-' + Date.now()
      });

      if (response.data.message) {
        alert('✅ Payment confirmed! Your guide is ready for download.');
        setPurchased(true);
        setShowPayment(false);
        if (response.data.download_token) {
          setDownloadToken(response.data.download_token);
        }
        await checkPurchaseStatus();
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      alert('❌ Payment confirmation failed: ' + (error.response?.data?.error || 'Please try again'));
    }
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Validate phone number for M-Pesa
    if (paymentMethod === 'mpesa') {
      if (!phoneNumber || phoneNumber.length < 10) {
        setError('Please enter a valid phone number (e.g., 254700000000)');
        return;
      }
    }

    setError('');
    setPurchasing(true);

    try {
      const response = await api.post('/guides/purchase', {
        guide_id: guide.id,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        card_number: cardNumber,
        card_expiry: cardExpiry,
        card_cvv: cardCvv
      });
      
      setPurchaseId(response.data.purchase_id);
      setShowPayment(true);
      
      if (paymentMethod === 'wallet') {
        await handlePaymentComplete();
      } else {
        alert(`Please complete payment using ${paymentMethod.toUpperCase()}.`);
      }
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
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

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Guide not found</h1>
          <Link href="/guides" className="text-yellow-400 hover:text-yellow-300 transition">
            ← Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto pb-16">
        <div className="flex justify-between items-center">
          <Link href="/guides" className="text-yellow-400 hover:text-yellow-300 transition">
            ← Back to Guides
          </Link>
          {purchased && downloadToken && (
            <a 
              href={`${api.defaults.baseURL}/guides/download/${downloadToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 text-sm transition font-medium"
            >
              📥 Download Guide
            </a>
          )}
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
         {guide.cover_image ? (
  <img src={guide.cover_image} alt={guide.title} className="w-full h-64 object-cover rounded-xl mb-6" />
) : (
  <div className="w-full h-64 bg-gradient-to-br from-yellow-500/20 to-green-500/20 rounded-xl mb-6 flex items-center justify-center text-8xl">📖</div>
)}

          <div className="flex items-center gap-2 mb-2">
            {guide.is_featured && (
              <span className="bg-yellow-400/20 text-yellow-400 text-xs px-3 py-1 rounded-full">⭐ Featured</span>
            )}
            {guide.category && (
              <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">{guide.category}</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">{guide.title}</h1>
          <p className="text-gray-300 mt-4 text-lg">{guide.description}</p>
          
          <div className="flex items-center gap-4 mt-6">
            <span className="text-3xl font-bold text-yellow-400">KES {guide.price}</span>
            {guide.file_size && (
              <span className="text-gray-400 text-sm">📦 {guide.file_size}</span>
            )}
          </div>

          {/* Payment Section - ALWAYS VISIBLE */}
          {!showPayment && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border transition ${
                      paymentMethod === 'mpesa' 
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    📱 M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border transition ${
                      paymentMethod === 'card' 
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border transition ${
                      paymentMethod === 'wallet' 
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    👛 Wallet
                  </button>
                </div>
              </div>

              {/* M-Pesa Phone Input */}
              {paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    placeholder="254700000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  />
                  <p className="text-gray-400 text-xs mt-1">Enter phone number without the + sign</p>
                </div>
              )}

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              {paymentMethod === 'wallet' && (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                  <p className="text-yellow-400">💳 Payment will be deducted from your AgriVibe Wallet balance.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 text-red-300 p-3 rounded-xl border border-red-500/30">
                  {error}
                </div>
              )}

              <PremiumButton 
                onClick={handlePurchase}
                variant="primary" 
                size="lg"
                className="w-full"
                disabled={purchasing}
              >
                {purchasing ? 'Processing...' : `Pay KES ${guide.price}`}
              </PremiumButton>
            </div>
          )}

          {/* Payment Processing */}
          {showPayment && !purchased && (
            <div className="mt-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <h3 className="text-xl font-semibold text-white">Processing Payment</h3>
              <p className="text-gray-400 mt-2">Please complete the payment on your phone.</p>
              <button
                onClick={handlePaymentComplete}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                I've Completed Payment
              </button>
            </div>
          )}

          <div className="mt-8 text-gray-400 text-sm">
            <p>📌 After purchase, you'll get instant access to download the guide.</p>
            <p>🔒 Secure payment via M-Pesa, Card, or Wallet.</p>
            <p>📧 You'll also receive the download link via Email and WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}