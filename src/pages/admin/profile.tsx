// src/pages/admin/profile.tsx
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
  Star,
  Users,
  ArrowRight,
  Settings,
  Bell,
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  LogOut,
  Lock,
  Key,
  Fingerprint,
  Globe,
  Clock,
  Eye,
  EyeOff,
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

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");
      const user = response.data.user || {};

      setProfile({
        id: user.id || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "admin",
        profileImage: user.profile_image || "",
        createdAt: user.created_at || new Date().toISOString(),
        lastLogin: user.last_login || new Date().toISOString(),
      });
      setImagePreview(user.profile_image || null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      const data = response.data.stats || {};
      setStats({
        totalUsers: data.totalUsers || 0,
        totalVendors: data.totalVendors || 0,
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
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
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchProfile();
    } catch (error: any) {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your administrator account
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
                  ? "bg-red-500 hover:bg-red-600 text-white"
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  {successMessage}
                </p>
                <p className="text-xs text-green-600">
                  Your changes have been saved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Vendors",
              value: stats.totalVendors,
              icon: Store,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Orders",
              value: stats.totalOrders,
              icon: ShoppingBag,
              color: "from-yellow-500 to-orange-500",
            },
            {
              label: "Revenue",
              value: `KES ${stats.totalRevenue.toLocaleString()}`,
              icon: Wallet,
              color: "from-purple-500 to-purple-600",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== PROFILE FORM ====== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* ====== PROFILE IMAGE ====== */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-4 border-purple-400/30 shadow-xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
                      {profile.firstName?.charAt(0)?.toUpperCase() || "👤"}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    {imagePreview && (
                      <button
                        onClick={removeImage}
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {isEditing && (
                <p className="text-gray-400 text-xs mt-2">
                  Click the camera to change profile photo
                </p>
              )}
            </div>

            {/* ====== FORM FIELDS ====== */}
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
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(profile.lastLogin)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== QUICK ACTIONS - ALL 4 FUNCTIONAL ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Change Password",
              icon: Key,
              onClick: () => setShowPasswordModal(true),
              color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
              description: "Update your password",
            },
            {
              label: "Security Settings",
              icon: Shield,
              onClick: () => router.push("/admin/settings"),
              color: "bg-red-50 text-red-600 hover:bg-red-100",
              description: "Manage security",
            },
            {
              label: "Audit Log",
              icon: Clock,
              onClick: () => router.push("/admin/audit"),
              color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
              description: "View activity log",
            },
            {
              label: "Logout",
              icon: LogOut,
              onClick: handleLogout,
              color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
              description: "Sign out",
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={action.onClick}
                className={`${action.color} rounded-2xl p-5 text-center transition-all duration-300 shadow-sm hover:shadow-md group`}
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

        {/* ====== ADMIN BADGE ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Administrator</span>
              </div>
              <h3 className="text-2xl font-bold mt-1">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-white/80 text-sm">{profile.email}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ====== CHANGE PASSWORD MODAL ====== */}
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
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
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
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
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
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
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
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
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

// Add missing imports
import { Store, ShoppingBag } from "lucide-react";
