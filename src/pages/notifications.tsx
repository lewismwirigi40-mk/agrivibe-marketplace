// src/pages/notifications.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  ShoppingBag,
  Truck,
  CreditCard,
  Package,
  X,
  ChevronLeft,
  Settings,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
  icon?: string;
  color?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log("🔔 Notification permission:", permission);
      if (permission === "granted") {
        console.log("✅ Notification permission granted");
      } else if (permission === "denied") {
        console.log("❌ Notification permission denied");
      } else {
        console.log("⏳ Notification permission pending");
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/notifications", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.data && response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread || 0);
      }
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      setError(error.response?.data?.error || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (!notifications.find((n) => n.id === id)?.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return X;
      case "order":
        return ShoppingBag;
      case "delivery":
        return Truck;
      case "payment":
        return CreditCard;
      case "system":
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500 bg-green-50 dark:bg-green-500/20";
      case "warning":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/20";
      case "error":
        return "text-red-500 bg-red-50 dark:bg-red-500/20";
      case "order":
        return "text-blue-500 bg-blue-50 dark:bg-blue-500/20";
      case "delivery":
        return "text-purple-500 bg-purple-50 dark:bg-purple-500/20";
      case "payment":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-500/20";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchNotifications}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-agrivibe-green text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Permission Banner */}
      {"Notification" in window && Notification.permission === "default" && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Enable notifications
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Get notified when your orders are updated
                </p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Allow
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error ? (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              No notifications
            </h3>
            <p className="text-gray-500 mt-2">
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                const colorClass = getIconColor(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-4 hover:shadow-md transition-all cursor-pointer ${
                      !notification.is_read
                        ? "border-agrivibe-green/30 dark:border-agrivibe-green/20"
                        : "border-gray-100 dark:border-white/10"
                    }`}
                    onClick={() => {
                      if (!notification.is_read) markAsRead(notification.id);
                      if (notification.link) {
                        router.push(notification.link);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-agrivibe-green rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-agrivibe-green hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-xs text-gray-400">
                {notifications.length} notifications
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
