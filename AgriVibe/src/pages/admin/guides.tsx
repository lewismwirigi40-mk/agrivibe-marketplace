// src/pages/admin/guides.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  DollarSign,
  Download,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Tag,
  Star,
  Users,
  Calendar,
  Globe,
  Shield
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminGuides() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    cover_image: '',
    file_url: '',
    file_size: '',
    is_featured: false
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [guideFile, setGuideFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // ============================================
  // FETCH GUIDES
  // ============================================
  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/guides');
      setGuides(response.data.guides || []);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      setError('Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // ============================================
  // HANDLE FORM CHANGES
  // ============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // ============================================
  // UPLOAD FILE
  // ============================================
  const uploadFile = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    
    try {
      const response = await api.post('/upload/single', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // ============================================
  // HANDLE COVER IMAGE CHANGE
  // ============================================
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCoverPreview(result);
        setFormData({ ...formData, cover_image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setFormData({ ...formData, cover_image: '' });
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  // ============================================
  // HANDLE GUIDE FILE CHANGE
  // ============================================
  const handleGuideFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGuideFile(e.target.files[0]);
      const size = (e.target.files[0].size / (1024 * 1024)).toFixed(1);
      setFormData({ ...formData, file_size: `${size}MB` });
    }
  };

  // ============================================
  // SUBMIT FORM
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    setUploading(true);
    setError('');

    try {
      let coverImageUrl = formData.cover_image;
      let fileUrl = formData.file_url;

      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile);
      }

      if (guideFile) {
        fileUrl = await uploadFile(guideFile);
      }

      const guideData = {
        ...formData,
        cover_image: coverImageUrl,
        file_url: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      };

      if (editing) {
        await api.put(`/guides/${editing.id}`, guideData);
        setSuccessMessage('✅ Guide updated successfully!');
      } else {
        await api.post('/guides', guideData);
        setSuccessMessage('✅ Guide created successfully!');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchGuides();
    } catch (error) {
      setError('Failed to save guide. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', category: '', cover_image: '', file_url: '', file_size: '', is_featured: false });
    setCoverFile(null);
    setGuideFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ============================================
  // DELETE GUIDE
  // ============================================
  const deleteGuide = async (id: string) => {
    try {
      await api.delete(`/guides/${id}`);
      setShowDeleteModal(null);
      setSuccessMessage('🗑️ Guide deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchGuides();
    } catch (error) {
      alert('Failed to delete guide');
    }
  };

  // ============================================
  // EDIT GUIDE
  // ============================================
  const editGuide = (guide: any) => {
    setEditing(guide);
    setFormData({
      title: guide.title,
      description: guide.description || '',
      price: guide.price,
      category: guide.category || '',
      cover_image: guide.cover_image || '',
      file_url: guide.file_url || '',
      file_size: guide.file_size || '',
      is_featured: guide.is_featured || false
    });
    setCoverPreview(guide.cover_image || null);
    setShowForm(true);
  };

  // ============================================
  // FILTER AND SORT
  // ============================================
  const filteredGuides = guides
    .filter(guide => {
      const matchesSearch = 
        guide.title?.toLowerCase().includes(search.toLowerCase()) ||
        guide.category?.toLowerCase().includes(search.toLowerCase()) ||
        guide.description?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && guide.is_active) ||
        (filter === 'inactive' && !guide.is_active) ||
        (filter === 'featured' && guide.is_featured);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const stats = {
    total: guides.length,
    active: guides.filter(g => g.is_active).length,
    featured: guides.filter(g => g.is_featured).length,
    totalDownloads: guides.reduce((sum, g) => sum + (g.downloads || 0), 0),
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading guides...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📚 Guides</h1>
            <p className="text-gray-500 mt-1">Manage AgriVibe guides and e-books</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              {stats.total} Total Guides
            </span>
            <button
              onClick={() => {
                setEditing(null);
                resetForm();
                setError('');
                setShowForm(!showForm);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Guide
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
              <span className="text-sm font-medium text-green-700">{successMessage}</span>
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
            { label: 'Total Guides', value: stats.total, icon: BookOpen, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Featured', value: stats.featured, icon: Star, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides by title, category or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            <div className="relative sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Guides</option>
                <option value="active">✅ Active</option>
                <option value="inactive">❌ Inactive</option>
                <option value="featured">⭐ Featured</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="downloads">Most Downloaded</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== FORM ====== */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Guide' : 'Create New Guide'}</h2>
                    <p className="text-sm text-gray-500">{editing ? 'Update guide information' : 'Add a new guide to your store'}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title *
                    </label>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all resize-none"
                        placeholder="Describe what this guide covers..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price (KES) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all appearance-none"
                        >
                          <option value="">Select Category</option>
                          <option value="Farming">🌾 Farming</option>
                          <option value="Business">💼 Business</option>
                          <option value="Technology">💻 Technology</option>
                          <option value="Marketing">📊 Marketing</option>
                          <option value="Sustainability">🌱 Sustainability</option>
                          <option value="Livestock">🐄 Livestock</option>
                          <option value="Crops">🌿 Crops</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cover Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                        {coverPreview ? (
                          <div className="relative w-full h-full group">
                            <img
                              src={coverPreview}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeCoverImage}
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
                      <div>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                          Choose Image
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                          Recommended: 800x600px, JPG or PNG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guide File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Guide File (PDF, DOCX, ZIP)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.zip,.doc,.docx"
                          onChange={handleGuideFileChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        />
                        {formData.file_size && (
                          <p className="text-xs text-gray-400 mt-1">📦 File size: {formData.file_size}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        formData.is_featured 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {formData.is_featured && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <label className="text-sm text-gray-700 cursor-pointer">
                      <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                      Feature this guide
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditing(null);
                        resetForm();
                        setError('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editing ? 'Update Guide' : 'Create Guide'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== GUIDES GRID ====== */}
        {filteredGuides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No guides found</h3>
            <p className="text-gray-500 text-lg">
              {search || filter !== 'all' ? 'Try adjusting your filters' : 'Create your first guide'}
            </p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    {guide.cover_image ? (
                      <img 
                        src={guide.cover_image} 
                        alt={guide.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-agrivibe-green/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {guide.is_featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          ⭐ Featured
                        </span>
                      )}
                      {guide.is_active ? (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-lg font-bold text-yellow-400">{formatCurrency(guide.price)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{guide.title}</h3>
                    {guide.category && (
                      <p className="text-xs text-gray-500 mt-1">{guide.category}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{guide.description || 'No description'}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {guide.downloads || 0} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(guide.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => editGuide(guide)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-agrivibe-green/10 text-agrivibe-green rounded-lg text-sm font-medium hover:bg-agrivibe-green/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(guide.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ====== GUIDE COUNT ====== */}
        {filteredGuides.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {filteredGuides.length} of {guides.length} guides
          </div>
        )}
      </div>

      {/* ====== DELETE CONFIRMATION MODAL ====== */}
      <AnimatePresence>
        {showDeleteModal && (
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
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Guide?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  This will permanently delete this guide and all its data. This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteGuide(showDeleteModal)}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

// Add missing imports
import { Type, AlignLeft, Check, Save } from 'lucide-react';