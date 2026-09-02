import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  ShoppingBag,
  Truck,
  CreditCard,
  Package,
  Sparkles,
  ChevronRight,
  Settings,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";
import api from "../services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "order"
    | "delivery"
    | "payment"
    | "system";
  is_read: boolean;
  created_at: string;
  link?: string;
  icon?: string; // ✅ Optional
  color?: string; // ✅ Optional
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ============================================
  // INITIALIZE AUDIO
  // ============================================
  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;

    // Preload audio
    audioRef.current.load();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ============================================
  // NETWORK STATUS MONITORING
  // ============================================
  useEffect(() => {
    // ✅ Set actual network status after mount (client-side only)
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      fetchNotifications();
      console.log("🌐 Network reconnected - fetching notifications");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("🌐 Network disconnected - notifications paused");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ============================================
  // FETCH NOTIFICATIONS (with sound detection)
  // ============================================
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Check network status
      if (!navigator.onLine) {
        console.warn("⚠️ Offline - notifications paused");
        setLoading(false);
        return;
      }

      const response = await api.get("/notifications/recent", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response && response.data) {
        const data = response.data;

        let newNotifications: Notification[] = [];
        let newUnreadCount = 0;

        if (data.success && data.notifications) {
          newNotifications = data.notifications || [];
          newUnreadCount = data.unread || 0;
        } else if (Array.isArray(data)) {
          newNotifications = data;
          newUnreadCount = data.filter((n: any) => !n.is_read).length;
        } else if (data.rows) {
          newNotifications = data.rows || [];
          newUnreadCount = data.unread || 0;
        }

        // ✅ PLAY SOUND IF NEW NOTIFICATIONS ARRIVED
        if (
          soundEnabled &&
          newUnreadCount > lastNotificationCount &&
          newUnreadCount > 0
        ) {
          playNotificationSound();
        }

        setNotifications(newNotifications);
        setUnreadCount(newUnreadCount);
        setLastNotificationCount(newUnreadCount);
      }
    } catch (error: any) {
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        console.warn("⚠️ Notifications background polling sync delayed.");
      } else {
        console.error("Failed to fetch notifications:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // PLAY NOTIFICATION SOUND
  // ============================================
  const playNotificationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn("🔊 Audio play failed:", err);
        });
      }

      // Also try to use Web Notification API
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🔔 AgriVibe", {
          body: "You have new notifications!",
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.warn("🔊 Sound notification error:", error);
    }
  };

  // ============================================
  // REQUEST NOTIFICATION PERMISSION
  // ============================================
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("🔔 Notification permission granted");
      }
    }
  };

  useEffect(() => {
    // Request permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(requestNotificationPermission, 5000);
    }
  }, []);

  // ============================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================
  // MARK AS READ
  // ============================================
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

  // ============================================
  // MARK ALL AS READ
  // ============================================
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // ============================================
  // DELETE NOTIFICATION
  // ============================================
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // ============================================
  // GET ICON
  // ============================================
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

  // ============================================
  // GET ICON COLOR
  // ============================================
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

  // ============================================
  // GET TIME AGO
  // ============================================
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  // ============================================
  // TOGGLE SOUND
  // ============================================
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell with Network Status */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
      >
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-agrivibe-green transition-colors" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-agrivibe-green/30"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
          {/* Network indicator */}
          {!isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 mt-2 w-[420px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 max-h-[520px] flex flex-col"
          >
            {/* Header with Premium Glow */}
            <div className="relative p-4 border-b border-gray-100 dark:border-white/10 bg-gradient-to-r from-agrivibe-green/5 to-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 opacity-50" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-agrivibe-green/20">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <p className="text-xs text-gray-400">
                      {unreadCount} unread
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                  )}
                  <button
                    onClick={toggleSound}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-agrivibe-green hover:text-emerald-600 transition-colors px-2 py-1 rounded-lg hover:bg-agrivibe-green/10"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-[340px] custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-agrivibe-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    const colorClass = getIconColor(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                        className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group relative ${
                          !notification.is_read
                            ? "bg-gradient-to-r from-agrivibe-green/5 to-transparent"
                            : ""
                        }`}
                        onClick={() => {
                          if (!notification.is_read)
                            markAsRead(notification.id);
                          if (notification.link)
                            window.location.href = notification.link;
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-gray-400">
                                {getTimeAgo(notification.created_at)}
                              </span>
                              {!notification.is_read && (
                                <span className="w-1.5 h-1.5 bg-agrivibe-green rounded-full" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-1 flex-shrink-0">
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-full mt-1 animate-pulse" />
                            )}
                            <button
                              onClick={(e) =>
                                deleteNotification(notification.id, e)
                              }
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center flex items-center justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/notifications";
                }}
                className="text-sm font-medium text-agrivibe-green hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/settings/notifications";
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
