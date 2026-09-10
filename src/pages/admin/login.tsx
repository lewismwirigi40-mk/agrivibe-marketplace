// src/pages/admin/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  ShieldCheck,
  Crown,
  Zap,
  Globe,
  Clock,
} from "lucide-react";
import api from "../../services/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [step, setStep] = useState<"credentials" | "totp">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ✅ TOTP Timer
  useEffect(() => {
    if (step === "totp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      setTimeLeft(30);
    }
  }, [step, timeLeft]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/admin-login", { email, password });

      if (response.data.success) {
        if (response.data.requiresTOTP) {
          setStep("totp");
          setTimeLeft(30);
          setLoading(false);
        } else {
          // Admin without TOTP setup - redirect to setup
          router.push("/admin/settings/security");
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/admin-verify-totp", {
        email,
        token: totpCode,
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid TOTP code");
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(30);
    setError("");
    // Trigger resend logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4 overflow-hidden">
      {/* ====== ANIMATED BACKGROUND ====== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-agrivibe-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-agrivibe-green/5 rounded-full blur-2xl animate-pulse delay-2000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* ====== GLOW EFFECT ====== */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-4 bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-3xl blur-3xl opacity-20"
        />

        {/* ====== MAIN CARD ====== */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", damping: 25 }}
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* ====== HEADER ====== */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-20 h-20 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-agrivibe-green/30"
            >
              <Shield className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-[8px] font-bold text-black">⚡</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mt-4 flex items-center justify-center gap-2"
            >
              Secure Admin Access
              <Crown className="w-4 h-4 text-yellow-400" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-agrivibe-green" />
              {step === "credentials"
                ? "Enter your credentials"
                : "Enter your TOTP code"}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px]">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Secure
              </span>
            </motion.p>
          </div>

          {/* ====== SECURITY BADGES ====== */}
          <div className="flex justify-center gap-2 mb-6">
            {[
              { icon: Shield, label: "TOTP 2FA" },
              { icon: Fingerprint, label: "IP Whitelist" },
              { icon: Clock, label: "15min Session" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full"
              >
                <badge.icon className="w-3 h-3 text-agrivibe-green" />
                <span className="text-[10px] text-gray-400">{badge.label}</span>
              </motion.div>
            ))}
          </div>

          {/* ====== ERROR MESSAGE ====== */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm mb-4"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====== CREDENTIALS STEP ====== */}
          <AnimatePresence mode="wait">
            {step === "credentials" && (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCredentialsSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300"
                      placeholder="admin@agrivibe.com"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* ====== TOTP STEP ====== */}
            {step === "totp" && (
              <motion.form
                key="totp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleTotpSubmit}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30"
                  >
                    <Smartphone className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <p className="text-gray-400 text-sm">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-2">
                    <Clock className="w-3 h-3" />
                    Code expires in {timeLeft}s
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) =>
                      setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full text-center text-3xl tracking-[0.5em] font-mono px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-agrivibe-green/5 to-transparent rounded-xl" />
                </div>

                {timeLeft === 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    type="button"
                    onClick={handleResendCode}
                    className="text-center w-full text-agrivibe-green text-sm hover:underline transition-colors"
                  >
                    Resend code
                  </motion.button>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setError("");
                    }}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || totpCode.length !== 6}
                    className="flex-1 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* ====== FOOTER ====== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-4 border-t border-white/5"
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>Secure Admin Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-agrivibe-green" />
                <span>Powered by AgriVibe</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-600">
              <span>v2.0.0</span>
              <span>•</span>
              <span>256-bit AES</span>
              <span>•</span>
              <span>TOTP Enabled</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ====== BOTTOM CREDITS ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 text-center text-[10px] text-gray-600"
      >
        <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
        <p className="mt-0.5">Enterprise-grade security • TOTP 2FA Protected</p>
      </motion.div>
    </div>
  );
}
