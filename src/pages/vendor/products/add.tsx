// src/pages/vendor/products/add.tsx
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Save,
  Tag,
  DollarSign,
  Box,
  Grid,
  Type,
  AlignLeft,
  Upload,
  Shield,
  Award,
  Clock,
  ChevronDown,
  AlertTriangle,
  Info,
  Layers,
  Weight,
  Ruler,
  ShoppingBag,
  Store,
  Eye,
  Zap,
  Crown,
  Gift,
  Heart,
  ThumbsUp,
  TrendingUp,
  Calendar,
  MapPin,
  Truck,
  RefreshCw,
} from "lucide-react";
import VendorLayout from "../../../components/VendorLayout";
import api from "../../../services/api";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "", // ✅ Changed from 'stock' to match backend
    unit: "kg",
    category: "",
    description: "",
    min_order: "1",
    weight: "",
    origin: "",
    harvest_date: "",
    is_organic: false,
    is_seasonal: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (formData.name.length < 3) {
      setError("Product name must be at least 3 characters");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      setError("Please enter a valid stock quantity");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.unit) {
      setError("Please select a unit");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // ✅ Prepare form data with proper fields
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        unit: formData.unit,
        category: formData.category,
        description: formData.description || "",
        min_order: parseInt(formData.min_order) || 1,
        weight: formData.weight || null,
        origin: formData.origin || null,
        harvest_date: formData.harvest_date || null,
        is_organic: formData.is_organic,
        is_seasonal: formData.is_seasonal,
        // ✅ Product starts with 'pending' status - requires admin approval
        status: "pending",
        is_approved: false,
      };

      // ✅ Send to vendor products endpoint
      const response = await api.post("/vendor/products", productData);

      // ✅ If we have an image, upload it
      if (imageFile && response.data?.product?.id) {
        try {
          const formDataImage = new FormData();
          formDataImage.append("image", imageFile);
          await api.post(
            `/vendor/products/${response.data.product.id}/image`,
            formDataImage,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        } catch (imgError) {
          console.warn(
            "Image upload failed, but product was created:",
            imgError,
          );
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/vendor/products");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to add product:", error);
      setError(
        error.response?.data?.error ||
          "Failed to add product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "", label: "Select Category", icon: "📋" },
    { value: "vegetables", label: "Vegetables", icon: "🥬" },
    { value: "fruits", label: "Fruits", icon: "🍎" },
    { value: "meat", label: "Meat", icon: "🥩" },
    { value: "dairy", label: "Dairy", icon: "🥛" },
    { value: "bakery", label: "Bakery", icon: "🥖" },
    { value: "poultry", label: "Poultry", icon: "🐔" },
    { value: "fish", label: "Fish", icon: "🐟" },
    { value: "cereals", label: "Cereals", icon: "🌾" },
    { value: "organic", label: "Organic", icon: "🌱" },
    { value: "herbs", label: "Herbs & Spices", icon: "🌿" },
    { value: "beverages", label: "Beverages", icon: "🧃" },
    { value: "processed", label: "Processed Foods", icon: "🥫" },
  ];

  const units = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "piece", label: "Piece" },
    { value: "bunch", label: "Bunch" },
    { value: "pack", label: "Pack" },
    { value: "liter", label: "Liter (L)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "dozen", label: "Dozen" },
    { value: "carton", label: "Carton" },
  ];

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Add New Product
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Add a new product to your store
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-500/30">
              <Clock className="w-4 h-4" />
              Pending Approval
            </span>
          </div>
        </div>

        {/* ====== ALERT ====== */}
        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
              Product must be approved by admin before going live
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
              Approval typically takes 24-48 hours. You'll be notified when
              approved.
            </p>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Product added successfully! 🎉
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Waiting for admin approval. Redirecting...
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

        {/* ====== FORM ====== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6 md:p-8"
        >
          {/* ====== PRODUCT IMAGE ====== */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image
              <span className="text-xs text-gray-400 ml-2">(Optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-400 mt-1">No image</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: Square image, JPG or PNG, max 5MB
                </p>
                {imageFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ {imageFile.name} ({(imageFile.size / 1024).toFixed(1)}{" "}
                    KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ====== BASIC INFO ====== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Product Name *
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  placeholder="e.g., Fresh Organic Tomatoes"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ====== PRICE & STOCK ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price (KES) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Stock Quantity *
              </label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                How many units do you have available?
              </p>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Unit *
              </label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
                  required
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ====== ADVANCED OPTIONS ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Minimum Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Minimum Order
              </label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="min_order"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.min_order}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Minimum quantity per order
              </p>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Weight (kg)
              </label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Origin
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="origin"
                  placeholder="e.g., Kiambu, Kenya"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* ====== DESCRIPTION ====== */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
              <span className="text-xs text-gray-400 ml-2">(Optional)</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your product... What makes it special? Include quality, freshness, and any unique features."
                value={formData.description}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-400">
                💡 AgriVibe AI will enhance your description with SEO-friendly
                keywords
              </p>
            </div>
          </div>

          {/* ====== PRODUCT ATTRIBUTES ====== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_organic"
                checked={formData.is_organic}
                onChange={handleChange}
                className="w-5 h-5 text-agrivibe-green focus:ring-agrivibe-green rounded"
              />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organic Product
                </label>
                <p className="text-xs text-gray-400">
                  Certified organic produce
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_seasonal"
                checked={formData.is_seasonal}
                onChange={handleChange}
                className="w-5 h-5 text-agrivibe-green focus:ring-agrivibe-green rounded"
              />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seasonal Product
                </label>
                <p className="text-xs text-gray-400">
                  Only available in season
                </p>
              </div>
            </div>
          </div>

          {/* ====== SUBMIT BUTTONS ====== */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Product for Approval
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* ====== FOOTER NOTES ====== */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Product will be reviewed by admin before going live</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Approval typically takes 24-48 hours</span>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
