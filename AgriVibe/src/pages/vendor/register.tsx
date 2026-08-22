// src/pages/vendor/register.tsx
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Store, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Building,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Truck,
  Package,
  Users,
  Award,
  ChevronRight,
  Image,
  X,
  Globe
} from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function VendorRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    // Store Info
    storeName: '',
    storeDescription: '',
    category: '',
    // Addresses
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    storeAddress: '', // ✅ NEW: Full store address for geocoding
    // Payment Details
    paymentMethod: 'mpesa',
    mpesaNumber: '',
    bankName: '',
    bankAccount: '',
    // Profile Image
    profileImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.password.trim()) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (stepNumber === 2) {
      if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
      if (!formData.storeDescription.trim()) newErrors.storeDescription = 'Store description is required';
      if (!formData.category) newErrors.category = 'Please select a category';
    }
    
    if (stepNumber === 3) {
      if (!formData.storeAddress.trim()) newErrors.storeAddress = 'Store address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.county.trim()) newErrors.county = 'County is required';
    }
    
    if (stepNumber === 4) {
      if (formData.paymentMethod === 'mpesa' && !formData.mpesaNumber.trim()) {
        newErrors.mpesaNumber = 'M-Pesa number is required';
      }
      if (formData.paymentMethod === 'bank') {
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!formData.bankAccount.trim()) newErrors.bankAccount = 'Bank account number is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    
    setLoading(true);
    // Will connect to backend later
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 2000);
    }, 1500);
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-premium-light overflow-x-hidden">
      <Navbar />
      
      <div className="container-premium pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* ====== HEADER ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Start Selling Today
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Become a <span className="text-gradient-green">Vendor</span>
            </h1>
            <p className="text-gray-500 mt-2">Complete all steps to start selling on AgriVibe</p>
          </motion.div>

          {/* ====== PROGRESS BAR ====== */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-agrivibe-green">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-3">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    s === step 
                      ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30 scale-110' 
                      : s < step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-xs hidden sm:inline ${
                    s === step ? 'text-agrivibe-green font-semibold' : 'text-gray-400'
                  }`}>
                    {s === 1 && 'Personal'}
                    {s === 2 && 'Store'}
                    {s === 3 && 'Address'}
                    {s === 4 && 'Payment'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ====== FORM CARD ====== */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* ====== STEP 1: Personal Info ====== */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-500">Tell us about yourself</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            }`}
                            required
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            }`}
                            required
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.email ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="phone"
                          placeholder="254700000000"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="password"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.password ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Profile Image (Optional)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                                <User className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-agrivibe-green text-white p-1.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>Upload a profile picture</p>
                          <p className="text-xs">JPG, PNG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Continue to Store Info
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* ====== STEP 2: Store Info ====== */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
                        <p className="text-sm text-gray-500">Tell us about your store</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Store Name *
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="storeName"
                          placeholder="e.g., Fresh Farm Produce"
                          value={formData.storeName}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.storeName ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.storeName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.storeName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Store Description *
                      </label>
                      <textarea
                        name="storeDescription"
                        placeholder="Describe your store and the products you offer..."
                        rows={4}
                        value={formData.storeDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 resize-none ${
                          errors.storeDescription ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                        }`}
                        required
                      />
                      {errors.storeDescription && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.storeDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Product Category *
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none ${
                            errors.category ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="vegetables">🥬 Vegetables</option>
                          <option value="fruits">🍎 Fruits</option>
                          <option value="meat">🥩 Meat</option>
                          <option value="dairy">🥛 Dairy</option>
                          <option value="bakery">🥖 Bakery</option>
                          <option value="poultry">🐔 Poultry</option>
                          <option value="fish">🐟 Fish</option>
                          <option value="cereals">🌾 Cereals</option>
                          <option value="organic">🌱 Organic</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.category}
                        </p>
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
                        type="button"
                        onClick={nextStep}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                      >
                        Continue to Address
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ====== STEP 3: Address ====== */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Store Address</h2>
                        <p className="text-sm text-gray-500">Where is your store located?</p>
                      </div>
                    </div>

                    {/* ✅ NEW: Store Address Field for Geocoding */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Store Address *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="storeAddress"
                          placeholder="e.g., Nyeri, Kenya"
                          value={formData.storeAddress}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.storeAddress ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.storeAddress && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.storeAddress}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        📍 This address will be used to show your products to nearby customers
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address Line 1 *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="addressLine1"
                          placeholder="Street address, building name"
                          value={formData.addressLine1}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.addressLine1 ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          }`}
                          required
                        />
                      </div>
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        name="addressLine2"
                        placeholder="Apartment, suite, unit"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          City *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="city"
                            placeholder="e.g., Nairobi"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.city ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            }`}
                            required
                          />
                        </div>
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          County *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="county"
                            placeholder="e.g., Kiambu"
                            value={formData.county}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.county ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            }`}
                            required
                          />
                        </div>
                        {errors.county && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.county}
                          </p>
                        )}
                      </div>
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
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ====== STEP 4: Payment Details ====== */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                        <p className="text-sm text-gray-500">Where your earnings will be sent (90% of sales)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Payment Method *
                      </label>
                      <div className="relative">
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                        >
                          <option value="mpesa">📱 M-Pesa</option>
                          <option value="bank">🏦 Bank Transfer</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {formData.paymentMethod === 'mpesa' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          M-Pesa Number *
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="mpesaNumber"
                            placeholder="254700000000"
                            value={formData.mpesaNumber}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.mpesaNumber ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            }`}
                            required
                          />
                        </div>
                        {errors.mpesaNumber && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.mpesaNumber}
                          </p>
                        )}
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
                              name="bankName"
                              placeholder="e.g., Equity Bank"
                              value={formData.bankName}
                              onChange={handleChange}
                              className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                                errors.bankName ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                              }`}
                              required
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
                              name="bankAccount"
                              placeholder="1234567890"
                              value={formData.bankAccount}
                              onChange={handleChange}
                              className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                                errors.bankAccount ? 'border-red-500' : 'border-gray-200 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                              }`}
                              required
                            />
                          </div>
                          {errors.bankAccount && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.bankAccount}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">
                          💡 Your payment details are securely stored. You'll receive 90% of each sale
                          after successful delivery confirmation.
                        </p>
                      </div>
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
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3.5 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Award className="w-5 h-5" />
                            Register Store
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* ====== TRUST BADGES ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-agrivibe-green" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-agrivibe-green" />
              <span>Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-agrivibe-green" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-agrivibe-green" />
              <span>Community Support</span>
            </div>
          </motion.div>

          {/* ====== ALREADY HAVE AN ACCOUNT ====== */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-agrivibe-green font-semibold hover:underline">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}