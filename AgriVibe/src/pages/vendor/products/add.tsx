// src/pages/vendor/products/add.tsx
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
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
  Award
} from 'lucide-react';
import VendorLayout from '../../../components/VendorLayout';
import api from '../../../services/api';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    unit: 'kg',
    category: '',
    description: '',
    status: 'pending',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Please enter a valid stock quantity');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Prepare form data for API
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock),
        unit: formData.unit,
        category: formData.category,
        description: formData.description || '',
        status: 'pending'
      };

      // If we have an image, upload it first or include in the request
      // For now, we'll just create the product
      await api.post('/products', productData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/vendor/products');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to add product:', error);
      setError(error.response?.data?.error || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Select Category', icon: '📋' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'meat', label: 'Meat', icon: '🥩' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'bakery', label: 'Bakery', icon: '🥖' },
    { value: 'poultry', label: 'Poultry', icon: '🐔' },
    { value: 'fish', label: 'Fish', icon: '🐟' },
    { value: 'cereals', label: 'Cereals', icon: '🌾' },
    { value: 'organic', label: 'Organic', icon: '🌱' },
  ];

  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'piece', label: 'Piece' },
    { value: 'bunch', label: 'Bunch' },
    { value: 'pack', label: 'Pack' },
    { value: 'liter', label: 'Liter (L)' },
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
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 mt-1">Add a new product to your store</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
              <Clock className="w-4 h-4" />
              Pending Approval
            </span>
          </div>
        </div>

        {/* ====== ALERT ====== */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-700 font-medium">Product must be approved by admin before going live</p>
            <p className="text-xs text-yellow-600 mt-0.5">Approval typically takes 24-48 hours</p>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-green-700 font-medium">Product added successfully!</p>
              <p className="text-xs text-green-600">Redirecting to products...</p>
            </div>
          </motion.div>
        )}

        {/* ====== ERROR ====== */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* ====== FORM ====== */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          {/* ====== PRODUCT IMAGE ====== */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
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
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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
                  <p className="text-xs text-green-600 mt-1">
                    ✅ {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name *
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  placeholder="e.g., Fresh Organic Tomatoes"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price *
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
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Price in Kenyan Shillings (KES)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity *
              </label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit
              </label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 appearance-none"
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

          {/* Description */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
              <span className="text-xs text-gray-400 ml-2">(Optional)</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your product... What makes it special?"
                value={formData.description}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-400">
                💡 AgriVibe AI will generate a description if left blank
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
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
                  Add Product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Your product will be reviewed by our admin team before going live</span>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}

// Add missing imports
import { Clock, ChevronDown } from 'lucide-react';