// src/pages/vendor/products/[id]/edit.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  X,
  Package,
  Upload,
  Image,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Crown,
  Shield,
  Zap,
  Store,
  DollarSign,
  Layers,
  Tag,
  Box,
  ShoppingBag,
  TrendingUp,
  Award,
  Star,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit,
  Eye,
  Copy,
  Share2,
  Download,
  Printer,
  Settings,
  HelpCircle,
  Gem,
  Wand2,
  Rocket,
  BadgeCheck,
} from "lucide-react";
import VendorLayout from "../../../../components/VendorLayout";
import api from "../../../../services/api";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState<any>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    unit: "piece",
    category_id: "",
    images: [],
    is_active: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get(`/vendor/products/${id}`);
      const data = response.data.product || response.data;
      setProduct({
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        stock_quantity: data.stock_quantity || 0,
        unit: data.unit || "piece",
        category_id: data.category_id || "",
        images: data.images || [],
        is_active: data.is_active !== false,
      });
      setImagePreviews(data.images || []);
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      setError(error.response?.data?.error || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: parseFloat(value) || 0 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setImageFiles([...imageFiles, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        category_id: product.category_id || null,
        is_active: product.is_active,
      };

      await api.put(`/vendor/products/${id}`, updateData);

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
        await api.post(`/vendor/products/${id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess("✨ Product updated successfully!");
      setTimeout(() => {
        router.push("/vendor/products");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update product:", error);
      setError(error.response?.data?.error || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-agrivibe-green/20 border-t-agrivibe-green rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-agrivibe-green animate-pulse" />
              </div>
            </div>
            <p className="text-gray-500 mt-4 font-medium">Loading product...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== PREMIUM HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-2xl shadow-agrivibe-green/20"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl animate-pulse delay-500" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/vendor/products")}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    Edit Product
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-gray-900 shadow-lg shadow-yellow-400/30">
                    <Gem className="w-3 h-3" />
                    Premium
                  </span>
                  {product.is_active && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-400/30 backdrop-blur-sm border border-green-300/30 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm flex items-center gap-2 mt-1">
                  <Store className="w-4 h-4" />
                  {product.name || "Update your product details"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs border border-white/20">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.is_active
                      ? "bg-green-400 animate-pulse"
                      : "bg-red-400"
                  }`}
                />
                {product.is_active ? "Active" : "Inactive"}
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs border border-white/20">
                <BadgeCheck className="w-3.5 h-3.5 text-yellow-300" />
                Verified
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== PREMIUM SUCCESS/ERROR ====== */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-green-500/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800 text-lg">{success}</p>
                <p className="text-sm text-green-600">
                  Your changes have been saved successfully
                </p>
              </div>
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative overflow-hidden bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-red-500/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-red-800 text-lg">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== PREMIUM FORM ====== */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative"
        >
          {/* Premium Glow Effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-agrivibe-green/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-8 space-y-8 z-10">
            {/* ====== PRODUCT NAME ====== */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-agrivibe-green" />
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-agrivibe-green transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                  Required
                </div>
              </div>
            </div>

            {/* ====== DESCRIPTION ====== */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Edit className="w-4 h-4 text-agrivibe-green" />
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  rows={4}
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 resize-none hover:border-gray-300 dark:hover:border-gray-600"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                  {product.description?.length || 0}/500
                </div>
              </div>
            </div>

            {/* ====== PRICE & STOCK ====== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-agrivibe-green" />
                  Price (KES) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    KES
                  </div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleNumberChange}
                    placeholder="0.00"
                    className="w-full pl-20 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Box className="w-4 h-4 text-agrivibe-green" />
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    name="stock_quantity"
                    min="0"
                    value={product.stock_quantity}
                    onChange={handleNumberChange}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ====== UNIT & CATEGORY ====== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-agrivibe-green" />
                  Unit
                </label>
                <div className="relative">
                  <select
                    name="unit"
                    value={product.unit}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <option value="piece">📦 Piece</option>
                    <option value="kg">⚖️ Kilogram (kg)</option>
                    <option value="g">⚖️ Gram (g)</option>
                    <option value="bunch">🌿 Bunch</option>
                    <option value="pack">📦 Pack</option>
                    <option value="box">📦 Box</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-agrivibe-green" />
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category_id"
                    value={product.category_id}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon || "📂"} {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== PREMIUM IMAGE UPLOAD ====== */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4 text-agrivibe-green" />
                Product Images
                <span className="text-xs text-gray-400 font-normal">
                  ({imagePreviews.length} uploaded)
                </span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ${
                  dragging
                    ? "border-agrivibe-green bg-agrivibe-green/10 shadow-lg shadow-agrivibe-green/20 scale-[1.02]"
                    : "border-gray-300 dark:border-gray-700 hover:border-agrivibe-green hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <motion.div
                    animate={
                      dragging
                        ? { scale: 1.1, rotate: 5 }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Drag & drop images here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-agrivibe-green font-semibold hover:underline transition-all"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recommended: 800x800px for best quality
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* ====== STATUS TOGGLE ====== */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-6 flex items-center justify-between border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    product.is_active
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/30"
                  }`}
                >
                  {product.is_active ? (
                    <CheckCircle className="w-7 h-7 text-white" />
                  ) : (
                    <X className="w-7 h-7 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {product.is_active
                      ? "Product is Live"
                      : "Product is Hidden"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.is_active
                      ? "Visible to customers and available for purchase"
                      : "Hidden from customers. Toggle to make it live."}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={(e) =>
                    setProduct({ ...product, is_active: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-16 h-9 bg-gray-300 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-agrivibe-green/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-agrivibe-green shadow-inner"></div>
              </label>
            </div>

            {/* ====== ACTION BUTTONS ====== */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {saving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Update Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/vendor/products")}
                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:shadow-lg"
              >
                Cancel
              </button>
            </div>

            {/* ====== PREMIUM FOOTER ====== */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-agrivibe-green" />
                  Secure
                </span>
                <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  Auto-save
                </span>
                <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <span className="flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-agrivibe-green" />
                  Premium
                </span>
                <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>
                  Product ID:{" "}
                  <span className="font-mono text-gray-500">{id}</span>
                </span>
                <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                <span>v2.0</span>
              </div>
            </div>
          </div>
        </motion.form>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </VendorLayout>
  );
}
