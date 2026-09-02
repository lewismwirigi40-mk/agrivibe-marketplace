// src/pages/driver/profile.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Car,
  Camera,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Award,
  Clock,
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
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import api from "../../services/api";

export default function DriverProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehiclePlate: "",
    vehicleColor: "",
    vehicleModel: "",
    address: "",
    profileImage: "",
    licenseNumber: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ REAL STATS from backend
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    rating: 0,
    totalEarnings: 0,
    acceptanceRate: 100,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  // ============================================
  // ✅ FETCH PROFILE FROM BACKEND
  // ============================================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch user profile
      const userRes = await api.get("/auth/profile");
      const user = userRes.data.user || userRes.data || {};

      // Fetch driver profile
      const driverRes = await api.get("/driver/profile");
      const driver = driverRes.data.driver || driverRes.data || {};

      setProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        vehicleType: driver.vehicle_type || "motorcycle",
        vehiclePlate: driver.vehicle_plate || "",
        vehicleColor: driver.vehicle_color || "",
        vehicleModel: driver.vehicle_model || "",
        address: user.location_address || "",
        profileImage: user.profile_image || "",
        licenseNumber: driver.license_number || "",
        bio: driver.bio || "",
      });

      if (user.profile_image) {
        setImagePreview(user.profile_image);
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      setError(error.response?.data?.error || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ FETCH REAL STATS
  // ============================================
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch driver stats
      const statsRes = await api.get("/driver/stats");
      const data = statsRes.data.stats || statsRes.data || {};

      setStats({
        totalDeliveries: data.total_deliveries || 0,
        completedDeliveries: data.completed_deliveries || 0,
        rating: data.rating || 0,
        totalEarnings: data.total_earnings || 0,
        acceptanceRate: data.acceptance_rate || 100,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to defaults if stats endpoint fails
    }
  };

  // ============================================
  // ✅ UPDATE PROFILE - REAL API
  // ============================================
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
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Update user profile
      await api.put("/auth/profile", {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        location_address: profile.address,
      });

      // Update driver profile
      await api.put("/driver/profile", {
        vehicle_type: profile.vehicleType,
        vehicle_plate: profile.vehiclePlate,
        vehicle_color: profile.vehicleColor,
        vehicle_model: profile.vehicleModel,
        license_number: profile.licenseNumber,
        bio: profile.bio,
        phone: profile.phone,
      });

      // Update localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...user,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh data
      await fetchProfile();
      await fetchStats();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

  // ✅ Real stats cards
  const statCards = [
    {
      label: "Total Deliveries",
      value: stats.totalDeliveries,
      icon: Truck,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Completed",
      value: stats.completedDeliveries,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Rating",
      value: `${stats.rating} ⭐`,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Earnings",
      value: `KES ${stats.totalEarnings}`,
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading profile...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your personal and vehicle information
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

        {/* ====== STATS CARDS - REAL DATA ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
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
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 border-4 border-agrivibe-green/30 shadow-xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
                      {profile.firstName?.charAt(0)?.toUpperCase() || "🚚"}
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
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-500">Driver</p>
              {isEditing && (
                <p className="text-gray-400 text-xs mt-2">
                  Click the camera to change profile photo
                </p>
              )}
            </div>

            {/* ====== FORM FIELDS ====== */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
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

                {/* Last Name */}
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

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
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

              {/* Phone */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="vehicleType"
                      value={profile.vehicleType}
                      onChange={(e) =>
                        setProfile({ ...profile, vehicleType: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 appearance-none ${
                        isEditing
                          ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                    >
                      <option value="motorcycle">Motorcycle</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                  </div>
                </div>

                {/* Plate Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Plate Number
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="vehiclePlate"
                      value={profile.vehiclePlate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      onFocus={() => setFocusedField("plateNumber")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? focusedField === "plateNumber"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                            : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                      placeholder="e.g., KCA 123A"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Vehicle Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vehicle Color
                  </label>
                  <div className="relative">
                    <input
                      name="vehicleColor"
                      value={profile.vehicleColor}
                      onChange={handleChange}
                      disabled={!isEditing}
                      onFocus={() => setFocusedField("vehicleColor")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-4 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? focusedField === "vehicleColor"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                            : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                      placeholder="e.g., Red, Blue, White"
                    />
                  </div>
                </div>

                {/* Vehicle Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vehicle Model
                  </label>
                  <div className="relative">
                    <input
                      name="vehicleModel"
                      value={profile.vehicleModel}
                      onChange={handleChange}
                      disabled={!isEditing}
                      onFocus={() => setFocusedField("vehicleModel")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-4 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing
                          ? focusedField === "vehicleModel"
                            ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                            : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      } outline-none`}
                      placeholder="e.g., Toyota, Honda"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing
                        ? focusedField === "address"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white"
                          : "border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    } outline-none`}
                  />
                </div>
              </div>

              {/* Bio/Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bio / Notes
                </label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing
                        ? "border-gray-200 text-gray-900 bg-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    } outline-none`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Save Button */}
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
              label: "View Deliveries",
              icon: Truck,
              color: "bg-blue-50 text-blue-600",
              href: "/driver/deliveries",
            },
            {
              label: "Earnings",
              icon: Wallet,
              color: "bg-green-50 text-green-600",
              href: "/driver/deliveries",
            },
            {
              label: "Notifications",
              icon: Bell,
              color: "bg-yellow-50 text-yellow-600",
              href: "/notifications",
            },
            {
              label: "Settings",
              icon: Settings,
              color: "bg-purple-50 text-purple-600",
              href: "/driver/settings",
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
      </div>
    </DriverLayout>
  );
}
