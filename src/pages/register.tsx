// src/pages/register.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Users,
  Truck,
  Store,
  ChevronRight,
  Award
} from 'lucide-react';
import { register } from '../services/auth';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFocusedField(null);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const validateForm = () => {
    // Validate first name
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return false;
    }
    
    // Validate last name
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate phone (Kenyan format)
    const phoneRegex = /^254[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number (e.g., 254700000000)');
      return false;
    }
    
    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Validate terms
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting registration with:', formData);
      
      const response = await register(formData);
      
      console.log('Registration response:', response);
      
      // Success - redirect to login
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration error details:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check for specific error types
      if (errorMessage.toLowerCase().includes('email')) {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (errorMessage.toLowerCase().includes('phone')) {
        errorMessage = 'This phone number is already registered. Please use a different number.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'customer', label: 'Customer', icon: Users, description: 'Buy fresh produce' },
    { value: 'vendor', label: 'Vendor', icon: Store, description: 'Sell your products' },
    { value: 'driver', label: 'Driver', icon: Truck, description: 'Deliver orders' },
  ];

  return (
    <div className="min-h-screen bg-premium-dark flex items-center justify-center p-4 relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-agrivibe-green/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-agrivibe-gold/20 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md my-8"
      >
        <motion.div
          whileHover={{ 
            scale: 1.02,
            rotateX: 2,
            rotateY: 2,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green/20 via-agrivibe-gold/20 to-agrivibe-green/20 rounded-3xl blur-2xl pointer-events-none" />
          
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agrivibe-green via-agrivibe-gold to-agrivibe-green pointer-events-none" />
            
            <div className="p-8 md:p-10">
              {/* Logo & Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-20 h-20 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-green cursor-pointer"
                >
                  <span className="text-4xl">🌾</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-white">Create Account</h1>
                <p className="text-gray-400 mt-1">Join AgriVibe today</p>
                
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-agrivibe-gold/50" />
                  <Sparkles className="w-4 h-4 text-agrivibe-gold" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-agrivibe-gold/50" />
                </div>
              </motion.div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('first_name')}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 outline-none transition-all ${
                        touchedFields.first_name && !formData.first_name.trim()
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-yellow-400'
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <input
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('last_name')}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 outline-none transition-all ${
                        touchedFields.last_name && !formData.last_name.trim()
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-yellow-400'
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 outline-none transition-all ${
                      touchedFields.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-yellow-400'
                    }`}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number (e.g., 254700000000)"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 outline-none transition-all ${
                      touchedFields.phone && formData.phone && !/^254[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-yellow-400'
                    }`}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 outline-none pr-12 transition-all ${
                      touchedFields.password && formData.password && formData.password.length < 6
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-yellow-400'
                    }`}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 -mt-2">Minimum 6 characters</p>

                {/* Role */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => handleFocus('role')}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition disabled:opacity-50"
                  disabled={loading}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label} — {option.description}
                    </option>
                  ))}
                </select>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (error) setError('');
                    }}
                    className="w-5 h-5 mt-1 accent-yellow-400 cursor-pointer disabled:opacity-50"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none">
                    I agree to the{' '}
                    <Link href="/terms" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl border border-red-500/30 overflow-hidden"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Register Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className={`w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3.5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Register
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-yellow-400 font-semibold hover:text-yellow-300 hover:underline transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mt-6 pt-6 border-t border-white/5"
              >
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>Secure Signup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>Data Protected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>Verified Users</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}