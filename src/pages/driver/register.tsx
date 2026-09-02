// src/pages/driver/register.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Truck,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import api from "../../services/api";

export default function DriverRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: "motorcycle",
    vehicle_plate: "",
    vehicle_color: "",
    vehicle_model: "",
    phone: "",
    license_number: "",
    license_expiry: "",
    bio: "",
  });

  const vehicleTypes = [
    { value: "motorcycle", label: "Motorcycle", icon: "🏍️" },
    { value: "car", label: "Car", icon: "🚗" },
    { value: "van", label: "Van", icon: "🚐" },
    { value: "truck", label: "Truck", icon: "🚛" },
    { value: "bicycle", label: "Bicycle", icon: "🚲" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.post("/driver/register", formData);

      if (response.data.success) {
        setSuccess(true);
        // ✅ Redirect to dashboard directly - NO APPROVAL NEEDED
        setTimeout(() => {
          router.push("/driver/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DriverLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Register as Driver
              </h1>
              <p className="text-gray-500 mt-1">
                Complete your driver profile to start earning
              </p>
            </div>
          </div>
        </div>

        {/* Success - No approval needed */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-700">
              You're a Driver Now! 🚚
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5"
        >
          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {vehicleTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, vehicle_type: type.value })
                  }
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.vehicle_type === type.value
                      ? "border-agrivibe-green bg-agrivibe-green/5 shadow-lg shadow-agrivibe-green/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl">{type.icon}</div>
                  <span className="text-xs font-medium text-gray-700">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Plate
              </label>
              <input
                name="vehicle_plate"
                value={formData.vehicle_plate}
                onChange={handleChange}
                placeholder="e.g., KCA 123A"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Color
              </label>
              <input
                name="vehicle_color"
                value={formData.vehicle_color}
                onChange={handleChange}
                placeholder="e.g., Red, Blue, White"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Model
              </label>
              <input
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="e.g., Toyota, Honda"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="254700000000"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* License Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                License Number
              </label>
              <input
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="DL123456"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                License Expiry
              </label>
              <input
                name="license_expiry"
                type="date"
                value={formData.license_expiry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio / About You
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your driving experience..."
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Truck className="w-5 h-5" />
                Register as Driver
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
            <Sparkles className="w-3 h-3 text-agrivibe-green" />
            <span>No approval needed - Start delivering immediately!</span>
          </div>
        </form>
      </div>
    </DriverLayout>
  );
}
