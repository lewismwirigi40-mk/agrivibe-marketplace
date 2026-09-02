// src/pages/forgot-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Lock,
  Send,
  User,
} from "lucide-react";
import api from "../services/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Call the backend API to send reset email
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.success) {
        setSuccess(true);
        // Auto redirect to login after 5 seconds
        setTimeout(() => {
          router.push("/login?reset=success");
        }, 5000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-agrivibe-green/15 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-agrivibe-gold/10 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Phone Frame Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative w-full max-w-[420px]"
      >
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-4 shadow-2xl shadow-black/50 border border-white/10">
          <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 rounded-[2.5rem] overflow-hidden border border-white/5">
            {/* Status Bar */}
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

            {/* Back Button */}
            <button
              onClick={() => router.push("/login")}
              className="absolute top-14 left-4 z-10 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Main Content */}
            <div className="relative z-10 px-6 pt-16 pb-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-agrivibe-green/30">
                  <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Forgot Password
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  We'll send you a reset link
                </p>
              </motion.div>

              {/* Success State */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 text-green-300 text-sm p-4 rounded-xl border border-green-500/30 text-center mb-4"
                  >
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                    <p className="font-semibold">Email Sent!</p>
                    <p className="text-xs text-green-300/70 mt-1">
                      Check your inbox for password reset instructions.
                    </p>
                    <p className="text-xs text-green-300/50 mt-3">
                      Redirecting to login in 5 seconds...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <p className="text-xs text-gray-500 mt-1.5">
                      Enter the email address you used to register.
                    </p>
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

                  {/* Submit Button */}
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reset Link
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Back to Login */}
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-agrivibe-green" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-agrivibe-green" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-agrivibe-green" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-4">
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
