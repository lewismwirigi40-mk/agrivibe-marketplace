// src/pages/admin/settings/security.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  Smartphone,
  Key,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import { useAdminGuard } from "../../../middleware/routeGuard";
import api from "../../../services/api";

export default function AdminSecurity() {
  useAdminGuard();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [setupStep, setSetupStep] = useState<"status" | "setup" | "verify">(
    "status",
  );

  useEffect(() => {
    fetchTOTPStatus();
  }, []);

  const fetchTOTPStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await api.get("/auth/totp-status");
      setTotpEnabled(response.data.totp_enabled || false);
    } catch (error) {
      console.error("Failed to fetch TOTP status:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTOTPSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/setup-totp");
      if (response.data.success) {
        setTotpSecret(response.data.secret);
        setQrCode(response.data.qrCode);
        setSetupStep("setup");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to setup TOTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setVerifying(true);
    setError("");
    try {
      const response = await api.post("/auth/verify-totp", {
        secret: totpSecret,
        token: verificationCode,
      });

      if (response.data.success) {
        setSuccess("TOTP enabled successfully!");
        setTotpEnabled(true);
        setSetupStep("status");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  const disableTOTP = async () => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;

    setLoading(true);
    try {
      await api.post("/auth/disable-totp");
      setTotpEnabled(false);
      setSuccess("2FA disabled successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setSuccess("Secret copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-agrivibe-green animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading security settings...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/settings")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Security Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Two-Factor Authentication (2FA) with Google Authenticator
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              {success}
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">
              {error}
            </span>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              {totpEnabled ? (
                <ShieldCheck className="w-7 h-7 text-green-500" />
              ) : (
                <ShieldAlert className="w-7 h-7 text-yellow-500" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totpEnabled
                  ? "2FA is enabled. Your account is secured with TOTP."
                  : "Add an extra layer of security to your account."}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${totpEnabled ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"}`}
            >
              {totpEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>
        </motion.div>

        {/* Setup Section */}
        {!totpEnabled && setupStep === "status" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    How it works
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scan the QR code with Google Authenticator to enable 2FA
                  </p>
                </div>
              </div>
              <button
                onClick={startTOTPSetup}
                className="w-full py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300"
              >
                Enable 2FA
              </button>
            </div>
          </motion.div>
        )}

        {/* Setup QR Code */}
        {setupStep === "setup" && qrCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-agrivibe-green" />
              Scan QR Code
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-white p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1. Install{" "}
                    <span className="font-medium text-white">
                      Google Authenticator
                    </span>{" "}
                    on your phone
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2. Scan the QR code or enter the secret key manually
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    3. Enter the 6-digit code to verify
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
                    {showSecret ? totpSecret : "••••••••••••••••"}
                  </div>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {showSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={copySecret}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-2xl tracking-widest font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                />
                <button
                  onClick={verifyTOTP}
                  disabled={verifying || verificationCode.length !== 6}
                  className="px-6 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {verifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {verifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disable 2FA */}
        {totpEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Disable 2FA
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This will remove the extra security layer from your account
                </p>
              </div>
              <button
                onClick={disableTOTP}
                className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-2xl border border-blue-200 dark:border-blue-500/20 p-6"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Security Tips
              </h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                <li>• Store your backup codes in a secure place</li>
                <li>
                  • Use a trusted authenticator app like Google Authenticator
                </li>
                <li>• Never share your verification codes with anyone</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
