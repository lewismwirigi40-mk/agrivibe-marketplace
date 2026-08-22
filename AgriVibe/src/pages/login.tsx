// src/pages/login.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  User,
  Fingerprint
} from 'lucide-react';
import { login } from '../services/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (!response.ok) setBackendAvailable(false);
      } catch {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(email, password);
      
      // Check user role and redirect accordingly
      if (userData.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData.user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (userData.user.role === 'driver') {
        router.push('/driver/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-agrivibe-green/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-agrivibe-gold/20 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
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
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 mt-1">Login to your AgriVibe account</p>
                
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-agrivibe-gold/50" />
                  <Sparkles className="w-4 h-4 text-agrivibe-gold" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-agrivibe-gold/50" />
                </div>
              </motion.div>

              {/* Backend Warning */}
              <AnimatePresence>
                {!backendAvailable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-500/20 text-yellow-300 text-sm p-4 rounded-xl border border-yellow-500/30 mb-6 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Backend Offline</span>
                      <p className="text-yellow-300/70 text-xs mt-0.5">Please start the backend server to login</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className={`relative group transition-all duration-300 ${
                    focusedField === 'email' ? 'scale-[1.02]' : ''
                  }`}>
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-agrivibe-green to-agrivibe-gold transition-all duration-300 ${
                      focusedField === 'email' ? 'w-full' : 'w-0'
                    }`} />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className={`relative group transition-all duration-300 ${
                    focusedField === 'password' ? 'scale-[1.02]' : ''
                  }`}>
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-agrivibe-green' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === 'password' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-agrivibe-green to-agrivibe-gold transition-all duration-300 ${
                      focusedField === 'password' ? 'w-full' : 'w-0'
                    }`} />
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-agrivibe-green border-agrivibe-green' 
                        : 'border-gray-500 group-hover:border-gray-400'
                    }`}>
                      {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="hidden"
                    />
                    Remember me
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-agrivibe-gold hover:text-yellow-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Error Message */}
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

                {/* Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green via-agrivibe-green-light to-agrivibe-green bg-[length:200%_100%] animate-gradient rounded-xl" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <div className="relative flex items-center justify-center gap-2 w-full px-6 py-4 text-white font-bold text-lg">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5" />
                          Login
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </motion.div>
              </form>

              {/* Register Link - Fixed: Now properly clickable */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-6"
              >
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-agrivibe-gold font-semibold hover:text-yellow-300 transition-colors hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-6 border-t border-white/5"
              >
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>Secure Login</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-agrivibe-green" />
                    <span>Verified Users</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Decorative Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}