// src/pages/guides/[slug].tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Lock, 
  Unlock, 
  ShoppingBag,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Award,
  Clock,
  FileText,
  BookOpen,
  Star,
  Users,
  TrendingUp,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (!token) return;
      
      const response = await api.get('/guides/my-guides');
      const purchases = response.data.purchases || [];
      const purchased = purchases.some((p: any) => p.guide?.slug === slug);
      setPurchased(purchased);
      if (purchased) {
        const guideData = purchases.find((p: any) => p.guide?.slug === slug);
        if (guideData) setDownloadToken(guideData.download_token);
      }
    } catch (error) {
      console.error('Failed to check purchase status:', error);
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
        setError('No purchase found. Please try again.');
        return;
      }

      const response = await api.post('/guides/confirm', {
        purchase_id: purchaseId,
        transaction_id: 'TXN-' + Date.now()
      });

      if (response.data.message) {
        setShowSuccess(true);
        setPurchased(true);
        setShowPayment(false);
        if (response.data.download_token) {
          setDownloadToken(response.data.download_token);
        }
        await checkPurchaseStatus();
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      setError(error.response?.data?.error || 'Payment confirmation failed. Please try again.');
    }
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

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
      }
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-light">
        <Navbar />
        <div className="container-premium pt-32 pb-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading guide...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-premium-light">
        <Navbar />
        <div className="container-premium pt-32 pb-16">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📖</div>
            <h1 className="text-3xl font-bold text-gray-800">Guide not found</h1>
            <Link href="/guides" className="inline-flex items-center gap-2 mt-4 text-agrivibe-green hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-premium-light overflow-x-hidden">
      <Navbar />

      <div className="container-premium pt-32 pb-16">
        {/* ====== BACK BUTTON ====== */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/guides" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-agrivibe-green transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Guides
          </Link>
          {purchased && downloadToken && (
            <a 
              href={`${api.defaults.baseURL}/guides/download/${downloadToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Guide
            </a>
          )}
        </div>

        {/* ====== MAIN CONTENT ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ====== LEFT COLUMN - GUIDE INFO ====== */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-72 overflow-hidden">
                {guide.cover_image ? (
                  <img 
                    src={guide.cover_image} 
                    alt={guide.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-agrivibe-green/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {guide.is_featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      ⭐ Featured
                    </span>
                  )}
                  {guide.category && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                      {guide.category}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-2xl font-bold text-yellow-400">KES {guide.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{guide.title}</h1>
                <p className="text-gray-600 text-lg mt-4 leading-relaxed">{guide.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {new Date(guide.updated_at).toLocaleDateString()}</span>
                  </div>
                  {guide.file_size && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>{guide.file_size}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{guide.purchases || 0} purchases</span>
                  </div>
                </div>

                {/* AI Description */}
                {guide.ai_description && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-agrivibe-green/5 to-emerald-500/5 rounded-xl border border-agrivibe-green/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-agrivibe-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">AI Summary</p>
                        <p className="text-sm text-gray-600 mt-1">{guide.ai_description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ====== RIGHT COLUMN - PURCHASE CARD ====== */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-32"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-agrivibe-green" />
                  Purchase Guide
                </h3>

                {/* Already Purchased */}
                {purchased ? (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-semibold text-green-700">Already Purchased</p>
                        <p className="text-sm text-green-600">You have full access to this guide</p>
                      </div>
                    </div>
                    <a 
                      href={`${api.defaults.baseURL}/guides/download/${downloadToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      Download Now
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Price Display */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-3xl font-bold text-agrivibe-green">KES {guide.price}</p>
                      <p className="text-xs text-gray-400 mt-1">One-time payment • Lifetime access</p>
                    </div>

                    {/* Payment Methods */}
                    {!showPayment && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Payment Method
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'mpesa', label: 'M-Pesa', icon: Smartphone },
                              { id: 'card', label: 'Card', icon: CreditCard },
                              { id: 'wallet', label: 'Wallet', icon: Wallet },
                            ].map((method) => {
                              const Icon = method.icon;
                              const isSelected = paymentMethod === method.id;
                              return (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => setPaymentMethod(method.id)}
                                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                                    isSelected 
                                      ? 'border-agrivibe-green bg-agrivibe-green/5 shadow-lg shadow-agrivibe-green/10' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 ${isSelected ? 'text-agrivibe-green' : 'text-gray-400'}`} />
                                  <span className={`text-xs font-medium ${isSelected ? 'text-agrivibe-green' : 'text-gray-600'}`}>
                                    {method.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* M-Pesa Input */}
                        {paymentMethod === 'mpesa' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              M-Pesa Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="254700000000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Enter phone number without the + sign</p>
                          </motion.div>
                        )}

                        {/* Card Input */}
                        {paymentMethod === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Card Number
                              </label>
                              <input
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Wallet Info */}
                        {paymentMethod === 'wallet' && (
                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <div className="flex items-start gap-3">
                              <Wallet className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-yellow-700">Wallet Payment</p>
                                <p className="text-xs text-yellow-600 mt-0.5">
                                  Payment will be deducted from your AgriVibe Wallet balance.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Error */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                          </motion.div>
                        )}

                        {/* Purchase Button */}
                        <button
                          onClick={handlePurchase}
                          disabled={purchasing}
                          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {purchasing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5" />
                              Pay KES {guide.price}
                            </>
                          )}
                        </button>

                        {/* Security Note */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Secure payment • Encrypted transaction</span>
                        </div>
                      </div>
                    )}

                    {/* Payment Processing */}
                    {showPayment && !purchased && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center"
                      >
                        <div className="text-4xl mb-3">⏳</div>
                        <h3 className="text-lg font-bold text-gray-900">Processing Payment</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Please complete the payment on your phone.
                        </p>
                        <button
                          onClick={handlePaymentComplete}
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          I've Completed Payment
                        </button>
                      </motion.div>
                    )}

                    {/* Success */}
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <div>
                            <p className="font-semibold text-green-700">Payment Successful!</p>
                            <p className="text-sm text-green-600">Your guide is ready for download.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Info Section */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant access after purchase
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Download via email & WhatsApp
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lifetime access
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}