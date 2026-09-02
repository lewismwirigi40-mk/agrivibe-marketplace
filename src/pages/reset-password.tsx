// src/pages/reset-password.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import api from "../services/api";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        new_password: password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?reset=done");
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Please try again.",
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

      {/* Phone Frame */}
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
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-agrivibe-green/30">
                  <span className="text-3xl">🔐</span>
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Reset Password
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Create a new password for your account
                </p>
              </div>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 text-green-300 text-sm p-4 rounded-xl border border-green-500/30 text-center mb-4"
                  >
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                    <p className="font-semibold">Password Reset!</p>
                    <p className="text-xs text-green-300/70 mt-1">
                      Your password has been changed successfully.
                    </p>
                    <p className="text-xs text-green-300/50 mt-3">
                      Redirecting to login...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      New Password
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
                        minLength={6}
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
                    <p className="text-xs text-gray-500 mt-1.5">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirm")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all text-sm ${
                          focusedField === "confirm"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/20"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
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

                  {/* Submit */}
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
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Reset Password
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
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
