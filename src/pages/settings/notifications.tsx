// src/pages/settings/notifications.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  Save,
  RefreshCw,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

interface NotificationSettings {
  // In-app notifications
  in_app_orders: boolean;
  in_app_payments: boolean;
  in_app_deliveries: boolean;
  in_app_promotions: boolean;

  // Email notifications
  email_orders: boolean;
  email_payments: boolean;
  email_deliveries: boolean;
  email_promotions: boolean;

  // SMS notifications
  sms_orders: boolean;
  sms_deliveries: boolean;
  sms_payments: boolean;

  // Push notifications (browser)
  push_orders: boolean;
  push_deliveries: boolean;
  push_promotions: boolean;

  // Sound
  sound_enabled: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [permissionStatus, setPermissionStatus] = useState<string>("default");
  const [settings, setSettings] = useState<NotificationSettings>({
    in_app_orders: true,
    in_app_payments: true,
    in_app_deliveries: true,
    in_app_promotions: false,
    email_orders: true,
    email_payments: true,
    email_deliveries: true,
    email_promotions: false,
    sms_orders: true,
    sms_deliveries: true,
    sms_payments: true,
    push_orders: true,
    push_deliveries: true,
    push_promotions: false,
    sound_enabled: true,
  });

  useEffect(() => {
    fetchSettings();
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === "granted") {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/settings/notifications");
      if (response.data && response.data.settings) {
        setSettings(response.data.settings);
      }
    } catch (error: any) {
      console.error("Failed to fetch notification settings:", error);
      // If no settings exist, use defaults (already set)
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await api.put("/settings/notifications", settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to save notification settings:", error);
      setError(error.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notification Settings
            </h1>
            <p className="text-sm text-gray-500">
              Control how you receive notifications
            </p>
          </div>
        </div>

        {/* ====== SUCCESS/ERROR MESSAGES ====== */}
        {success && (
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </motion.div>
        )}

        {/* ====== BROWSER NOTIFICATION PERMISSION ====== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Browser Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Get notifications directly in your browser
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Permission Status
              </p>
              <p
                className={`text-sm ${
                  permissionStatus === "granted"
                    ? "text-green-500"
                    : permissionStatus === "denied"
                      ? "text-red-500"
                      : "text-yellow-500"
                }`}
              >
                {permissionStatus === "granted"
                  ? "✅ Enabled"
                  : permissionStatus === "denied"
                    ? "❌ Blocked"
                    : "⏳ Not set"}
              </p>
            </div>
            {permissionStatus !== "granted" && (
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                {permissionStatus === "denied"
                  ? "Open Settings"
                  : "Enable Notifications"}
              </button>
            )}
          </div>
        </div>

        {/* ====== NOTIFICATION CATEGORIES ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* In-App Notifications */}
          <SettingsCard
            title="In-App Notifications"
            icon={Bell}
            description="Show notifications inside the app"
            settings={settings}
            keys={[
              {
                key: "in_app_orders",
                label: "Order Updates",
                icon: ShoppingBag,
              },
              {
                key: "in_app_payments",
                label: "Payment Alerts",
                icon: CreditCard,
              },
              {
                key: "in_app_deliveries",
                label: "Delivery Updates",
                icon: Truck,
              },
              {
                key: "in_app_promotions",
                label: "Promotions & Offers",
                icon: Sparkles,
              },
            ]}
            onToggle={toggleSetting}
          />

          {/* Email Notifications */}
          <SettingsCard
            title="Email Notifications"
            icon={Mail}
            description="Receive notifications via email"
            settings={settings}
            keys={[
              {
                key: "email_orders",
                label: "Order Updates",
                icon: ShoppingBag,
              },
              {
                key: "email_payments",
                label: "Payment Alerts",
                icon: CreditCard,
              },
              {
                key: "email_deliveries",
                label: "Delivery Updates",
                icon: Truck,
              },
              {
                key: "email_promotions",
                label: "Promotions & Offers",
                icon: Sparkles,
              },
            ]}
            onToggle={toggleSetting}
          />

          {/* SMS Notifications */}
          <SettingsCard
            title="SMS Notifications"
            icon={Smartphone}
            description="Receive notifications via SMS"
            settings={settings}
            keys={[
              { key: "sms_orders", label: "Order Updates", icon: ShoppingBag },
              {
                key: "sms_payments",
                label: "Payment Alerts",
                icon: CreditCard,
              },
              { key: "sms_deliveries", label: "Delivery Updates", icon: Truck },
            ]}
            onToggle={toggleSetting}
          />

          {/* Push Notifications */}
          <SettingsCard
            title="Push Notifications"
            icon={MessageCircle}
            description="Receive push notifications"
            settings={settings}
            keys={[
              { key: "push_orders", label: "Order Updates", icon: ShoppingBag },
              {
                key: "push_deliveries",
                label: "Delivery Updates",
                icon: Truck,
              },
              {
                key: "push_promotions",
                label: "Promotions & Offers",
                icon: Sparkles,
              },
            ]}
            onToggle={toggleSetting}
          />
        </div>

        {/* ====== SOUND SETTINGS ====== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Notification Sounds
                  </h3>
                  <p className="text-sm text-gray-500">
                    Play sound when new notifications arrive
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("sound_enabled")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.sound_enabled
                  ? "bg-agrivibe-green"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                  settings.sound_enabled ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ====== SAVE BUTTON ====== */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </DashboardLayout>
  );
}

// ============================================
// SETTINGS CARD COMPONENT
// ============================================

interface SettingsCardProps {
  title: string;
  icon: any;
  description: string;
  settings: any;
  keys: { key: string; label: string; icon: any }[];
  onToggle: (key: string) => void;
}

function SettingsCard({
  title,
  icon: Icon,
  description,
  settings,
  keys,
  onToggle,
}: SettingsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-agrivibe-green/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-agrivibe-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {keys.map((item) => {
          const isEnabled = settings[item.key] ?? false;
          const ItemIcon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ItemIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              </div>
              <button
                onClick={() => onToggle(item.key)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  isEnabled
                    ? "bg-agrivibe-green"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    isEnabled ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
