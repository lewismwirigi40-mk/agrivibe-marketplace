// src/pages/login.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
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
  Fingerprint,
  Smartphone,
  ChevronLeft,
} from "lucide-react";
import { login } from "../services/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/health");
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
    setError("");

    try {
      const userData = await login(email, password);

      if (userData && userData.token) {
        localStorage.setItem("token", userData.token);
      }
      if (userData && userData.user) {
        localStorage.setItem("user", JSON.stringify(userData.user));
      }

      if (userData?.vendor) {
        localStorage.setItem(
          "vendorStatus",
          userData.vendor.status || "pending",
        );
      }

      localStorage.removeItem("isRedirecting");

      if (userData?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (userData?.user?.role === "vendor") {
        const redirectPath = userData.redirectTo || "/vendor/dashboard";
        router.push(redirectPath);
      } else if (userData?.user?.role === "driver") {
        router.push("/driver/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("❌ Authentication error:", err);
      setError(
        err.response?.data?.error ||
          "Login failed. Please verify your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-agrivibe-green/15 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-agrivibe-gold/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-agrivibe-green/5 via-transparent to-agrivibe-gold/5 rounded-full blur-3xl" />
      </div>

      {/* ====== PHONE FRAME CONTAINER ====== */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative w-full max-w-[420px]"
      >
        {/* Phone Frame Outer */}
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-4 shadow-2xl shadow-black/50 border border-white/10">
          {/* Phone Frame Inner */}
          <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 rounded-[2.5rem] overflow-hidden border border-white/5">
            {/* Status Bar - Top */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <span>9:41</span>
                <span className="text-xs">📶</span>
                <span className="text-xs">🔋</span>
              </div>
            </div>

            {/* Back Button - Top Left */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-14 left-4 z-10 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* ====== MAIN CONTENT ====== */}
            <div className="relative z-10 px-6 pt-16 pb-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-16 h-16 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-agrivibe-green/30 cursor-pointer"
                >
                  <span className="text-3xl">🌾</span>
                </motion.div>
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Login to your AgriVibe account
                </p>
              </motion.div>

              {/* Backend Warning */}
              <AnimatePresence>
                {!backendAvailable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-500/20 text-yellow-300 text-xs p-3 rounded-xl border border-yellow-500/30 mb-4 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Backend Offline</span>
                      <p className="text-yellow-300/70 text-xs">
                        Please start the backend server to login
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all text-sm ${
                        focusedField === "email"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/20"
                          : "border-white/10 hover:border-white/20"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all text-sm ${
                        focusedField === "password"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/20"
                          : "border-white/10 hover:border-white/20"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me + Forgot Password - BOTH WORKING */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                        rememberMe
                          ? "bg-agrivibe-green border-agrivibe-green"
                          : "border-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {rememberMe && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="hidden"
                    />
                    Remember me
                  </label>
                  {/* ✅ FORGOT PASSWORD - FULLY CLICKABLE */}
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-xs text-agrivibe-gold hover:text-yellow-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/20 text-red-300 text-xs p-3 rounded-xl border border-red-500/30 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green via-emerald-500 to-agrivibe-green bg-[length:200%_100%] animate-gradient rounded-xl" />
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative flex items-center justify-center gap-2 w-full px-6 py-3.5 text-white font-semibold text-sm">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4" />
                        Login
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* ✅ CREATE ACCOUNT - FULLY CLICKABLE */}
              <div className="text-center mt-5">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-agrivibe-gold font-semibold hover:text-yellow-300 transition-colors hover:underline cursor-pointer bg-transparent border-none text-sm"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-white/5 flex justify-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-agrivibe-green" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-agrivibe-green" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-agrivibe-green" />
                  <span>Verified Users</span>
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-[10px] mt-4">
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
