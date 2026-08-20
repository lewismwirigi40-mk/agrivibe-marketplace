// src/pages/vendor/settings.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Camera, 
  Save, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  Smartphone,
  Building,
  User,
  Map,
  Navigation,
  Power,
  Edit,
  Image,
  X
} from 'lucide-react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Store Settings
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [isActive, setIsActive] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  
  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/stores/my-store');
      const store = response.data.store;
      if (store) {
        setStoreName(store.store_name || '');
        setStoreDescription(store.description || '');
        setContactEmail(store.contact_email || '');
        setContactPhone(store.contact_phone || '');
        setStoreAddress(store.address || '');
        setDeliveryRadius(store.delivery_radius || 15);
        setIsActive(store.is_active !== false);
        setProfileImage(store.profile_image || '');
        setPaymentMethod(store.payment_method || 'mpesa');
        setMpesaNumber(store.mpesa_number || '');
        setBankName(store.bank_name || '');
        setBankAccount(store.bank_account || '');
        setAccountHolder(store.account_holder || '');
      }
    } catch (error) {
      console.error('Failed to fetch store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!storeName.trim()) newErrors.storeName = 'Store name is required';
    if (!contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(contactEmail)) newErrors.contactEmail = 'Please enter a valid email';
    if (!contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!storeAddress.trim()) newErrors.storeAddress = 'Store address is required';
    if (paymentMethod === 'mpesa' && !mpesaNumber.trim()) {
      newErrors.mpesaNumber = 'M-Pesa number is required';
    }
    if (paymentMethod === 'bank') {
      if (!bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!bankAccount.trim()) newErrors.bankAccount = 'Bank account number is required';
      if (!accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      // TODO: Connect to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-500 mt-1">Manage your store information and payment details</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Store settings updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ====== PROFILE IMAGE ====== */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 border-4 border-agrivibe-green/30 shadow-xl">
                  {profileImage ? (
                    <img src={profileImage} alt="Store" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
                      {storeName?.charAt(0)?.toUpperCase() || '🏪'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white p-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-gray-500 text-sm mt-3">Click the camera icon to upload a store logo</p>
              <p className="text-gray-400 text-xs">Recommended: Square image, at least 200x200px</p>
            </div>
          </div>

          {/* ====== STORE INFORMATION ====== */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
                <p className="text-sm text-gray-500">Basic information about your store</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Name *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                      errors.storeName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                    }`}
                    placeholder="Enter your store name"
                  />
                </div>
                {errors.storeName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.storeName}
                  </p>
                )}
              </div>

              {/* Store Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Description
                </label>
                <textarea
                  rows={3}
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 resize-none"
                  placeholder="Describe your store and the products you sell..."
                />
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                        errors.contactEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                      }`}
                      placeholder="store@example.com"
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                        errors.contactPhone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                      }`}
                      placeholder="254700000000"
                    />
                  </div>
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contactPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Store Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                      errors.storeAddress ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                    }`}
                    placeholder="Your store location address"
                  />
                </div>
                {errors.storeAddress && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.storeAddress}
                  </p>
                )}
              </div>

              {/* Delivery Radius & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Radius (km)
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={deliveryRadius}
                      onChange={(e) => setDeliveryRadius(Number(e.target.value))}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Store Status
                  </label>
                  <div className="relative">
                    <Power className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={isActive ? 'active' : 'inactive'}
                      onChange={(e) => setIsActive(e.target.value === 'active')}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                    >
                      <option value="active">🟢 Active - Store is visible</option>
                      <option value="inactive">🔴 Inactive - Store is hidden</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====== PAYMENT DETAILS ====== */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <p className="text-sm text-gray-500">Where your earnings will be sent (90% of sales)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Payment Method *
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                  >
                    <option value="mpesa">📱 M-Pesa</option>
                    <option value="bank">🏦 Bank Transfer</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {paymentMethod === 'mpesa' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    M-Pesa Number *
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      placeholder="254700000000"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                        errors.mpesaNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                      }`}
                    />
                  </div>
                  {errors.mpesaNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.mpesaNumber}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1.5">Your earnings will be sent to this M-Pesa number</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bank Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        placeholder="e.g., Equity Bank"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                          errors.bankName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                        }`}
                      />
                    </div>
                    {errors.bankName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bankName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bank Account Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        placeholder="1234567890"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                          errors.bankAccount ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                        }`}
                      />
                    </div>
                    {errors.bankAccount && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bankAccount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Account Holder Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        placeholder="Full name on the bank account"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                          errors.accountHolder ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                        }`}
                      />
                    </div>
                    {errors.accountHolder && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.accountHolder}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ====== SAVE BUTTON ====== */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
            <button
              type="button"
              onClick={fetchStoreSettings}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* ====== INFO CARD ====== */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  💡 Your payment details are securely stored. Earnings (90% of sales) will be sent 
                  to your selected payment method after successful delivery confirmation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}

// Add missing imports
import { ChevronDown } from 'lucide-react';