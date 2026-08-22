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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
      <div className="absolute inset-0 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green/20 via-agrivibe-gold/20 to-agrivibe-green/20 rounded-3xl blur-2xl" />
          
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agrivibe-green via-agrivibe-gold to-agrivibe-green" />
            
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
                  className="w-20 h-20 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-green"
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                      focusedField === 'first_name' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('first_name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-3 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'first_name' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                      focusedField === 'last_name' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('last_name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-3 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'last_name' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="relative group">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'phone' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number (e.g., 254700000000)"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'phone' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'password' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    I want to join as a
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-agrivibe-green outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-white/20"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                          {option.label} — {option.description}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Terms */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <button
                    type="button"
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      agreeTerms 
                        ? 'bg-agrivibe-green border-agrivibe-green' 
                        : 'border-gray-500 hover:border-gray-400'
                    }`}>
                      {agreeTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                  <p className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-agrivibe-gold hover:text-yellow-300 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-agrivibe-gold hover:text-yellow-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/20 text-red-300 text-sm p-4 rounded-xl border border-red-500/30 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Register Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <button
  type="submit"
  disabled={loading}
  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
      Creating Account...
    </>
  ) : (
    <>
      <Award className="w-5 h-5" />
      Register
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </>
  )}
</button>
                </motion.div>
              </form>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-6"
              >
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-agrivibe-gold font-semibold hover:text-yellow-300 transition-colors hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </motion.div>

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