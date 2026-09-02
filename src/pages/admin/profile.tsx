// src/pages/admin/profile.tsx - ENHANCED VISUAL VERSION
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Award,
  Calendar,
  TrendingUp,
  Users,
  Store,
  ShoppingBag,
  Wallet,
  LogOut,
  Key,
  Clock,
  Eye,
  EyeOff,
  TrendingDown,
  Activity,
  Zap,
  Check,
  ArrowUpRight,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";
import { useRouter } from "next/router";

export default function AdminProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "",
    createdAt: "",
    lastLogin: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Stats with changes
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    usersChange: 0,
    vendorsChange: 0,
    ordersChange: 0,
    revenueChange: 0,
  });

  // Activity data
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      const response = await api.get("/auth/profile");
      const user = response.data || response.data.user || {};

      setProfile({
        id: user.id || "",
        firstName: user.first_name || user.firstName || "",
        lastName: user.last_name || user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "admin",
        profileImage: user.profile_image || user.avatar || "",
        createdAt:
          user.created_at || user.createdAt || new Date().toISOString(),
        lastLogin:
          user.last_login || user.lastLogin || new Date().toISOString(),
      });
      setImagePreview(user.profile_image || user.avatar || null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      const data = response.data.stats || response.data || {};

      // Calculate percentage changes (mock for demo - you can replace with real data)
      const calculateChange = (current: number, previous?: number) => {
        if (!previous || previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      setStats({
        totalUsers: data.totalUsers || 0,
        totalVendors: data.totalVendors || 0,
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        usersChange: calculateChange(data.totalUsers || 0, data.previousUsers),
        vendorsChange: calculateChange(
          data.totalVendors || 0,
          data.previousVendors,
        ),
        ordersChange: calculateChange(
          data.totalOrders || 0,
          data.previousOrders,
        ),
        revenueChange: calculateChange(
          data.totalRevenue || 0,
          data.previousRevenue,
        ),
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get("/audit?limit=3");
      const data = response.data.logs || response.data || [];
      setRecentActivities(data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      // Fallback activities
      setRecentActivities([
        {
          action: "Logged in",
          timestamp: new Date().toISOString(),
          type: "login",
          user: "Admin",
        },
        {
          action: "Viewed dashboard",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "view",
          user: "Admin",
        },
        {
          action: "Updated settings",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: "update",
          user: "Admin",
        },
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setProfile({ ...profile, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setProfile({ ...profile, profileImage: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!profile.lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!profile.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.put("/auth/profile", {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
      });

      setSuccessMessage("Profile updated successfully!");
      setShowSuccess(true);
      setIsEditing(false);

      localStorage.setItem(
        "userName",
        `${profile.firstName} ${profile.lastName}`,
      );

      setTimeout(() => setShowSuccess(false), 3000);
      await fetchProfile();
    } catch (error: any) {
      console.error("Update profile error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");

    try {
      await api.put("/auth/change-password", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password changed successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 2000);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.error ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Helper to get gradient based on value
  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-400";
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Activity;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER WITH ENHANCED DESIGN ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Profile
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Manage your administrator account
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">
                Last login: {formatTime(profile.lastLogin)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              <Shield className="w-4 h-4" />
              {profile.role || "Admin"}
            </span>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError("");
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-r from-agrivibe-green to-emerald-500 hover:shadow-xl hover:shadow-agrivibe-green/30 text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-green-500/10"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">
                  {successMessage}
                </p>
                <p className="text-xs text-green-600">
                  Your changes have been saved successfully.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-red-500/10"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ENHANCED STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              change: stats.usersChange,
            },
            {
              label: "Vendors",
              value: stats.totalVendors,
              icon: Store,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50",
              change: stats.vendorsChange,
            },
            {
              label: "Orders",
              value: stats.totalOrders,
              icon: ShoppingBag,
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50",
              change: stats.ordersChange,
            },
            {
              label: "Revenue",
              value: `KES ${stats.totalRevenue.toLocaleString()}`,
              icon: Wallet,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
              change: stats.revenueChange,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = getTrendIcon(stat.change);
            const trendColor = getTrendColor(stat.change);
            const isPositive = stat.change > 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 cursor-pointer group transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
                      <span className={`text-xs font-semibold ${trendColor}`}>
                        {stat.change > 0 ? "+" : ""}
                        {stat.change}%
                      </span>
                      <span className="text-xs text-gray-400">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(Math.abs(stat.change) * 2, 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== PROFILE FORM WITH ENHANCED VISUAL ====== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* ====== PROFILE IMAGE WITH ENHANCED DESIGN ====== */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-4 border-white shadow-xl ring-2 ring-purple-400/30">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200">
                      {profile.firstName?.charAt(0)?.toUpperCase() || "👤"}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 w-10 h-10 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              {isEditing && (
                <p className="text-gray-400 text-xs mt-3 flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Click camera to change photo • PNG, JPG up to 5MB
                </p>
              )}
              {!isEditing && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* ====== ENHANCED FORM FIELDS ====== */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? focusedField === "firstName"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                            : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? focusedField === "lastName"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                            : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={profile.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing
                        ? focusedField === "phone"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                          : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    } outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={profile.role || "Admin"}
                    disabled
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                    {profile.role || "Admin"}
                  </span>
                </div>
              </div>

              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              )}
            </form>

            {!isEditing && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Member Since</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Last Login</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(profile.lastLogin)} at{" "}
                    {formatTime(profile.lastLogin)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== ENHANCED QUICK ACTIONS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Security Settings",
              icon: Shield,
              onClick: () => router.push("/admin/settings"),
              color:
                "bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200",
              description: "Manage security",
              border: "border-red-200",
            },
            {
              label: "Audit Log",
              icon: Clock,
              onClick: () => router.push("/admin/audit"),
              color:
                "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200",
              description: "View activity log",
              border: "border-blue-200",
            },
            {
              label: "Change Password",
              icon: Key,
              onClick: () => setShowPasswordModal(true),
              color:
                "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 hover:from-yellow-100 hover:to-yellow-200",
              description: "Update password",
              border: "border-yellow-200",
            },
            {
              label: "Logout",
              icon: LogOut,
              onClick: handleLogout,
              color:
                "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200",
              description: "Sign out",
              border: "border-gray-200",
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`${action.color} border ${action.border} rounded-2xl p-5 text-center transition-all duration-300 shadow-sm hover:shadow-lg group`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-md transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold block">
                  {action.label}
                </span>
                <span className="text-xs text-gray-400">
                  {action.description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ====== ENHANCED ADMIN BADGE ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-white/80">
                  Administrator
                </span>
                <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pro
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-1">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-white/80 text-sm">{profile.email}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ====== CHANGE PASSWORD MODAL (Enhanced) ====== */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Change Password
                      </h2>
                      <p className="text-white/80 text-sm">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {passwordSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Password Updated!
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Your password has been changed successfully.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/10 outline-none transition-all"
                        />
                        <button
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/10 outline-none transition-all"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Minimum 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/10 outline-none transition-all"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{passwordError}</span>
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordError("");
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {changingPassword ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
