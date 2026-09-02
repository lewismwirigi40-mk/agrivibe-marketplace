// src/pages/vendor/settings.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  Smartphone,
  Building,
  User,
  Map,
  Navigation,
  Power,
  Edit,
  Image,
  X,
  ChevronDown,
  Lock,
  Key,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Crown,
  Zap,
  RefreshCw,
  AlertTriangle,
  Info,
  HelpCircle,
  Bell,
  Settings as SettingsIcon,
  Globe2,
  Languages,
  Moon,
  Sun,
  Printer,
  Download,
  Share2,
} from "lucide-react";
import VendorLayout from "../../components/VendorLayout";
import api from "../../services/api";
import { useRouter } from "next/router";

export default function VendorSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<
    "store" | "payment" | "security" | "preferences"
  >("store");

  // Store Settings
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [isActive, setIsActive] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [businessHours, setBusinessHours] = useState({
    open: "08:00",
    close: "18:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  });

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    orderUpdates: true,
    marketing: false,
  });
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Africa/Nairobi");

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch vendor profile
      const profileResponse = await api.get("/vendor/profile");
      const vendor = profileResponse.data.vendor || profileResponse.data;

      if (vendor) {
        setStoreName(vendor.business_name || "");
        setStoreDescription(vendor.business_description || "");
        setContactEmail(vendor.business_email || vendor.User?.email || "");
        setContactPhone(vendor.business_phone || vendor.User?.phone || "");
        setStoreAddress(vendor.business_address || "");
        setProfileImage(vendor.business_logo || "");
        setIsActive(vendor.is_active !== false);
      }

      // Fetch payment settings
      const paymentResponse = await api
        .get("/vendor/payment-settings")
        .catch(() => ({ data: {} }));
      const paymentData = paymentResponse.data || {};
      setPaymentMethod(paymentData.method || "mpesa");
      setMpesaNumber(paymentData.mpesa_number || "");
      setBankName(paymentData.bank_name || "");
      setBankAccount(paymentData.bank_account || "");
      setAccountHolder(paymentData.account_holder || "");
      setBankBranch(paymentData.bank_branch || "");
    } catch (error) {
      console.error("Failed to fetch store settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setProfileImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStoreForm = () => {
    const newErrors: Record<string, string> = {};
    if (!storeName.trim()) newErrors.storeName = "Store name is required";
    if (!contactEmail.trim())
      newErrors.contactEmail = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(contactEmail))
      newErrors.contactEmail = "Please enter a valid email";
    if (!contactPhone.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (!storeAddress.trim())
      newErrors.storeAddress = "Store address is required";
    if (paymentMethod === "mpesa" && !mpesaNumber.trim()) {
      newErrors.mpesaNumber = "M-Pesa number is required";
    }
    if (paymentMethod === "bank") {
      if (!bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!bankAccount.trim())
        newErrors.bankAccount = "Bank account number is required";
      if (!accountHolder.trim())
        newErrors.accountHolder = "Account holder name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStoreForm()) return;

    setSaving(true);
    setError("");

    try {
      // Update vendor profile
      await api.put("/vendor/profile", {
        business_name: storeName,
        business_description: storeDescription,
        business_email: contactEmail,
        business_phone: contactPhone,
        business_address: storeAddress,
        is_active: isActive,
      });

      // Upload image if changed
      if (imageFile) {
        const formData = new FormData();
        formData.append("logo", imageFile);
        await api.post("/vendor/upload-logo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Update payment settings
      await api.put("/vendor/payment-settings", {
        method: paymentMethod,
        mpesa_number: mpesaNumber,
        bank_name: bankName,
        bank_account: bankAccount,
        account_holder: accountHolder,
        bank_branch: bankBranch,
      });

      setSuccessMessage("Store settings updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      setError(error.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");

    try {
      await api.put("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setPasswordSuccess(false);
        setSuccessMessage("Password changed successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 2000);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.error || "Failed to change password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading settings...
            </p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Store Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your store information, payment details, and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={fetchStoreSettings}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
              className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-green-500/10"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {successMessage}
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
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== TABS ====== */}
        <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 p-2">
          {[
            { id: "store", label: "Store Info", icon: Store },
            { id: "payment", label: "Payment", icon: CreditCard },
            { id: "security", label: "Security", icon: Lock },
            { id: "preferences", label: "Preferences", icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActiveTab = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  isActiveTab
                    ? "bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white shadow-lg shadow-agrivibe-green/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleStoreSubmit} className="space-y-6">
          {/* ====== TAB CONTENT ====== */}
          <AnimatePresence mode="wait">
            {/* Store Information Tab */}
            {activeTab === "store" && (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 border-4 border-agrivibe-green/30 shadow-xl">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Store"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100 dark:bg-gray-800">
                          {storeName?.charAt(0)?.toUpperCase() || "🏪"}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white p-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors border-2 border-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                    Click the camera icon to upload a store logo
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    Recommended: Square image, at least 200x200px, max 5MB
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Store Name *
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                          errors.storeName
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                        }`}
                        placeholder="Enter your store name"
                      />
                    </div>
                    {errors.storeName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.storeName}
                      </p>
                    )}
                  </div>

                  {/* Store Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 resize-none"
                      placeholder="Describe your store and the products you sell..."
                    />
                  </div>

                  {/* Contact Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Contact Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.contactEmail
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                          }`}
                          placeholder="store@example.com"
                        />
                      </div>
                      {errors.contactEmail && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contactEmail}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Contact Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.contactPhone
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                          }`}
                          placeholder="254700000000"
                        />
                      </div>
                      {errors.contactPhone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contactPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Store Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Store Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                          errors.storeAddress
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                        }`}
                        placeholder="Your store location address"
                      />
                    </div>
                    {errors.storeAddress && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.storeAddress}
                      </p>
                    )}
                  </div>

                  {/* Delivery Radius & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Delivery Radius (km)
                      </label>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={deliveryRadius}
                          onChange={(e) =>
                            setDeliveryRadius(Number(e.target.value))
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Store Status
                      </label>
                      <div className="relative">
                        <Power className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={isActive ? "active" : "inactive"}
                          onChange={(e) =>
                            setIsActive(e.target.value === "active")
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                        >
                          <option value="active">
                            🟢 Active - Store is visible
                          </option>
                          <option value="inactive">
                            🔴 Inactive - Store is hidden
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Payment Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Where your earnings will be sent (90% of sales)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Payment Method *
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="mpesa">📱 M-Pesa</option>
                        <option value="bank">🏦 Bank Transfer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {paymentMethod === "mpesa" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        M-Pesa Number *
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          placeholder="254700000000"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                            errors.mpesaNumber
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                          }`}
                        />
                      </div>
                      {errors.mpesaNumber && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.mpesaNumber}
                        </p>
                      )}
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1.5">
                        Your earnings will be sent to this M-Pesa number
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Bank Name *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            placeholder="e.g., Equity Bank"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.bankName
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                            }`}
                          />
                        </div>
                        {errors.bankName && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.bankName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Bank Account Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            placeholder="1234567890"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.bankAccount
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                            }`}
                          />
                        </div>
                        {errors.bankAccount && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.bankAccount}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Account Holder Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            placeholder="Full name on the bank account"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                              errors.accountHolder
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 dark:border-gray-700 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10"
                            }`}
                          />
                        </div>
                        {errors.accountHolder && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.accountHolder}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Bank Branch (Optional)
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            placeholder="e.g., Nairobi CBD"
                            value={bankBranch}
                            onChange={(e) => setBankBranch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Security Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Change your password and security preferences
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordSuccess && (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700 dark:text-green-400">
                        Password changed successfully!
                      </span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-400">
                        {passwordError}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                      />
                      <button
                        type="button"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password (min 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                      />
                      <button
                        type="button"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                      />
                      <button
                        type="button"
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

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {changingPassword ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Preferences
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Customize your experience
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Language & Timezone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        <Languages className="w-4 h-4 inline mr-2" />
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="en">🇬🇧 English</option>
                        <option value="sw">🇰🇪 Swahili</option>
                        <option value="fr">🇫🇷 French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        <Globe2 className="w-4 h-4 inline mr-2" />
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="Africa/Nairobi">🇰🇪 Nairobi (EAT)</option>
                        <option value="Africa/Lagos">🇳🇬 Lagos (WAT)</option>
                        <option value="Africa/Cairo">🇪🇬 Cairo (EET)</option>
                        <option value="Africa/Johannesburg">
                          🇿🇦 Johannesburg (SAST)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-400" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      {[
                        { key: "email", label: "Email Notifications" },
                        { key: "sms", label: "SMS Notifications" },
                        { key: "push", label: "Push Notifications" },
                        { key: "orderUpdates", label: "Order Updates" },
                        { key: "marketing", label: "Marketing Communications" },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {label}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                notifications[key as keyof typeof notifications]
                              }
                              onChange={() =>
                                handleNotificationToggle(
                                  key as keyof typeof notifications,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-agrivibe-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agrivibe-green"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====== SAVE BUTTON ====== */}
          {activeTab !== "security" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={fetchStoreSettings}
                className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>
          )}

          {/* ====== INFO CARD ====== */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 Your payment details are securely stored. Earnings (90% of
                  sales) will be sent to your selected payment method after
                  successful delivery confirmation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
