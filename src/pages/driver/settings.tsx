// src/pages/driver/settings.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  LogOut,
  User,
  Truck,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import api from "../../services/api";

export default function DriverSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    darkMode: true,
    soundEnabled: true,
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* ====== SUCCESS ====== */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium text-green-700">
              Settings saved successfully!
            </p>
          </motion.div>
        )}

        {/* ====== NOTIFICATIONS ====== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                Manage how you receive updates
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "emailNotifications", label: "Email Notifications" },
              { key: "smsNotifications", label: "SMS Notifications" },
              { key: "pushNotifications", label: "Push Notifications" },
            ].map((item) => {
              const isEnabled = settings[item.key as keyof typeof settings];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  <button
                    onClick={() =>
                      toggleSetting(item.key as keyof typeof settings)
                    }
                    className={`w-12 h-7 rounded-full transition-all duration-300 ${isEnabled ? "bg-blue-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${isEnabled ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====== PREFERENCES ====== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-500">Customize your experience</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">
                Dark Mode
              </span>
              <button
                onClick={() => toggleSetting("darkMode")}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${settings.darkMode ? "bg-blue-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${settings.darkMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">
                Notification Sounds
              </span>
              <button
                onClick={() => toggleSetting("soundEnabled")}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${settings.soundEnabled ? "bg-blue-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${settings.soundEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ====== ACCOUNT ====== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Account</h2>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </DriverLayout>
  );
}
