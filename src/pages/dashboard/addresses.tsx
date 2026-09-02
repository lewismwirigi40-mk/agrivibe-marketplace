// src/pages/dashboard/addresses.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Home,
  Building,
  Smartphone,
  User,
  Mail,
  Sparkles,
  Shield,
  Award,
  Clock,
  ArrowRight,
  AlertCircle,
  Check,
  Star,
  Truck,
  Globe,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

interface Address {
  id: string;
  label: string;
  address: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    phone: "",
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ============================================
  // ✅ FETCH ADDRESSES FROM BACKEND
  // ============================================
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/addresses");
      setAddresses(response.data.addresses || []);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      setError(error.response?.data?.error || "Failed to load addresses");
      // ✅ Fallback to empty array (no dummy data)
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ ADD/UPDATE ADDRESS
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label.trim()) {
      setError("Label is required");
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let response;
      if (editing) {
        // ✅ UPDATE existing address
        response = await api.put(`/addresses/${editing.id}`, formData);
        setSuccessMessage("Address updated successfully!");
      } else {
        // ✅ CREATE new address
        response = await api.post("/addresses", formData);
        setSuccessMessage("Address added successfully!");
      }

      // ✅ Refresh the list
      await fetchAddresses();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowForm(false);
      setEditing(null);
      setFormData({ label: "", address: "", phone: "", isDefault: false });
    } catch (error: any) {
      console.error("Failed to save address:", error);
      setError(
        error.response?.data?.error ||
          "Failed to save address. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // ✅ SET DEFAULT ADDRESS
  // ============================================
  const setDefault = async (id: string) => {
    try {
      await api.put(`/addresses/${id}/default`);
      await fetchAddresses();
      setSuccessMessage("Default address updated!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to set default address:", error);
      setError("Failed to update default address");
    }
  };

  // ============================================
  // ✅ DELETE ADDRESS
  // ============================================
  const deleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
      setSuccessMessage("Address deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to delete address:", error);
      setError("Failed to delete address");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError("");
  };

  const getLabelIcon = (label: string) => {
    const icons: Record<string, any> = {
      home: Home,
      campus: Building,
      office: Building,
      work: Building,
    };
    return icons[label?.toLowerCase()] || MapPin;
  };

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      home: "from-blue-500 to-blue-600",
      campus: "from-purple-500 to-purple-600",
      office: "from-orange-500 to-orange-600",
      work: "from-green-500 to-green-600",
    };
    return colors[label?.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  const labelOptions = [
    { value: "Home", icon: Home },
    { value: "Campus", icon: Building },
    { value: "Office", icon: Building },
    { value: "Other", icon: MapPin },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading addresses...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-500 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({
                label: "",
                address: "",
                phone: "",
                isDefault: false,
              });
              setShowForm(true);
              setError("");
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Address
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
              <span className="text-sm font-medium text-green-700">
                {successMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ADD/EDIT FORM ====== */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editing ? "Edit Address" : "Add New Address"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editing
                        ? "Update your address details"
                        : "Enter your delivery address details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    setError("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address Label
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {labelOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.label === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, label: option.value })
                          }
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? "border-agrivibe-green bg-agrivibe-green/5 shadow-lg shadow-agrivibe-green/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isSelected ? "text-agrivibe-green" : "text-gray-400"}`}
                          />
                          <span
                            className={`text-xs font-medium ${isSelected ? "text-agrivibe-green" : "text-gray-600"}`}
                          >
                            {option.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {error && !formData.label && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select a label
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("address")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === "address"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="phone"
                      placeholder="254700000000"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                        focusedField === "phone"
                          ? "border-agrivibe-green shadow-lg shadow-agrivibe-green/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isDefault: !formData.isDefault,
                      })
                    }
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.isDefault
                        ? "bg-agrivibe-green border-agrivibe-green"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {formData.isDefault && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <label className="text-sm text-gray-700 cursor-pointer">
                    Set as default address
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                      setError("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editing ? "Update Address" : "Add Address"}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ADDRESSES LIST ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <div className="text-8xl mb-6">📍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No Addresses Saved
                </h3>
                <p className="text-gray-500 text-lg mb-8">
                  Add your first delivery address
                </p>
                <button
                  onClick={() => {
                    setEditing(null);
                    setFormData({
                      label: "",
                      address: "",
                      phone: "",
                      isDefault: false,
                    });
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Address
                </button>
              </motion.div>
            ) : (
              addresses.map((addr, index) => {
                const LabelIcon = getLabelIcon(addr.label);
                const labelColor = getLabelColor(addr.label);

                return (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 ${
                      addr.isDefault
                        ? "border-agrivibe-green shadow-agrivibe-green/10"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${labelColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <LabelIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {addr.label}
                            </h3>
                            {addr.isDefault && (
                              <span className="inline-flex items-center gap-1 bg-agrivibe-green/10 text-agrivibe-green text-xs font-semibold px-2.5 py-1 rounded-full">
                                <Star className="w-3 h-3 fill-agrivibe-green" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            {addr.address}
                          </p>
                          <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5" />
                            {addr.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditing(addr);
                            setFormData(addr);
                            setShowForm(true);
                            setError("");
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr.id)}
                        className="mt-4 text-sm text-agrivibe-green hover:text-emerald-600 font-medium transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Set as Default
                      </button>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* ====== ADDRESS COUNT ====== */}
        {addresses.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            You have {addresses.length} saved{" "}
            {addresses.length === 1 ? "address" : "addresses"}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
