// src/pages/dashboard/profile.tsx
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
  Star,
  Settings,
  Wallet,
  ShoppingBag,
  Heart,
  School,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    campus: "",
    profileImage: "",
    createdAt: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    reviewCount: 0,
    memberSince: "New Member",
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/profile");
      const user = response.data.user || response.data || {};

      setProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        campus: user.campus || user.location_address || "",
        profileImage: user.profile_image || "",
        createdAt: user.created_at || "",
        role: user.role || "customer",
      });

      if (user.profile_image) {
        setImagePreview(user.profile_image);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile data");
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setProfile({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          campus: user.campus || "",
          profileImage: user.profile_image || "",
          createdAt: user.created_at || "",
          role: user.role || "customer",
        });
      } catch (e) {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let totalOrders = 0;
      try {
        const ordersRes = await api.get("/orders/my-orders");
        const orders = ordersRes.data.orders || [];
        totalOrders = orders.length;
      } catch (e) {
        console.warn("Orders endpoint error:", e);
        totalOrders = 0;
      }

      let wishlistCount = 0;
      try {
        const wishlistRes = await api.get("/wishlist");
        wishlistCount = wishlistRes.data.items?.length || 0;
      } catch (e) {
        console.warn("Wishlist endpoint not available yet");
        wishlistCount = 0;
      }

      let reviewCount = 0;
      try {
        const reviewsRes = await api.get("/reviews/my-reviews");
        reviewCount = reviewsRes.data.reviews?.length || 0;
      } catch (e) {
        console.warn("Reviews endpoint not available yet");
        reviewCount = 0;
      }

      // ✅ Get member since from actual user creation date
      let memberSince = "New Member";
      if (profile.createdAt) {
        try {
          const date = new Date(profile.createdAt);
          memberSince = date.toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (e) {
          memberSince = "New Member";
        }
      }

      setStats({
        totalOrders,
        wishlistCount,
        reviewCount,
        memberSince,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
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

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again");
        return;
      }

      await api.put("/auth/profile", {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        campus: profile.campus,
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...user,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        campus: profile.campus,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setError(
        error.response?.data?.error ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
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

  const getDisplayName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (profile.firstName) return profile.firstName;
    if (profile.email) return profile.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }
    if (profile.firstName) return profile.firstName.charAt(0).toUpperCase();
    if (profile.email) return profile.email.charAt(0).toUpperCase();
    return "U";
  };

  // ✅ Stat cards - "Member Since" removed to avoid dummy data
  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      href: "/dashboard/orders",
    },
    {
      label: "Wishlist",
      value: stats.wishlistCount,
      icon: Heart,
      color: "from-red-500 to-red-600",
      href: "/dashboard/wishlist",
    },
    {
      label: "Reviews",
      value: stats.reviewCount,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      href: "/dashboard/reviews",
    },
    // ✅ "Member Since" REMOVED - No more dummy "2024"!
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your personal information
            </p>
          </div>
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
                  Profile updated successfully!
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.a
                key={index}
                href={stat.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 block"
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
              </motion.a>
            );
          })}
        </div>

        {/* ====== PROFILE FORM ====== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* ====== PROFILE IMAGE ====== */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 border-4 border-agrivibe-green/30 shadow-xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100 font-bold text-agrivibe-green">
                      {getInitials()}
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
              <h2 className="text-xl font-bold text-gray-900 mt-3">
                {getDisplayName()}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {profile.role || "Customer"}
              </p>
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
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
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
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
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
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
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
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing
                        ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    } outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Campus / Location
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="campus"
                    value={profile.campus}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing
                        ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    } outline-none`}
                    placeholder="e.g., DeKUT, Nyeri"
                  />
                </div>
              </div>

              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* ====== SECURITY NOTE ====== */}
            {!isEditing && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Your information is securely stored and only visible to
                      authorized personnel.
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Click "Edit Profile" to update your details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== QUICK ACTIONS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "My Orders",
              icon: ShoppingBag,
              color: "bg-blue-50 text-blue-600",
              href: "/dashboard/orders",
            },
            {
              label: "Wishlist",
              icon: Heart,
              color: "bg-red-50 text-red-600",
              href: "/dashboard/wishlist",
            },
            {
              label: "Wallet",
              icon: Wallet,
              color: "bg-green-50 text-green-600",
              href: "/dashboard/wallet",
            },
            {
              label: "Settings",
              icon: Settings,
              color: "bg-purple-50 text-purple-600",
              href: "/dashboard/settings",
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={index}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`${action.color} rounded-2xl p-4 text-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer block`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-medium">{action.label}</span>
              </motion.a>
            );
          })}
        </div>

        {/* ✅ "Member Since" CARD REMOVED - No more dummy "2024" watermark */}
      </div>
    </DashboardLayout>
  );
}
