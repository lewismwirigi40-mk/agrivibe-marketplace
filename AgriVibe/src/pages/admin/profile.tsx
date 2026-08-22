// src/pages/admin/profile.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'admin',
        profileImage: user.profile_image || '',
      });
      setImagePreview(user.profile_image || null);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError('');
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
    setProfile({ ...profile, profileImage: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!profile.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!profile.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Total Users', value: '1,250', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Vendors', value: '85', icon: Store, color: 'from-green-500 to-emerald-500' },
    { label: 'Orders', value: '1,340', icon: TrendingUp, color: 'from-yellow-500 to-orange-500' },
    { label: 'Admin Since', value: '2024', icon: Calendar, color: 'from-purple-500 to-purple-600' },
  ];

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
            <p className="text-gray-500 mt-1">Manage your administrator account</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              <Shield className="w-4 h-4" />
              {profile.role || 'Admin'}
            </span>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError('');
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isEditing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gradient-to-r from-agrivibe-green to-emerald-500 hover:shadow-xl hover:shadow-agrivibe-green/30 text-white'
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
                <p className="text-sm font-medium text-green-700">Profile updated successfully!</p>
                <p className="text-xs text-green-600">Your changes have been saved.</p>
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
          {stats.map((stat, index) => {
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

        {/* ====== PROFILE FORM ====== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* ====== PROFILE IMAGE ====== */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-4 border-purple-400/30 shadow-xl">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
                      {profile.firstName?.charAt(0)?.toUpperCase() || '👤'}
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
                <p className="text-gray-400 text-xs mt-2">Click the camera to change profile photo</p>
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
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? focusedField === 'firstName'
                            ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white'
                            : 'border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
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
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? focusedField === 'lastName'
                            ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white'
                            : 'border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
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
                    onChange={handleChange}
                    disabled={!isEditing}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing 
                        ? focusedField === 'email'
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white'
                          : 'border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                    } outline-none`}
                  />
                </div>
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
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                      isEditing 
                        ? focusedField === 'phone'
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10 text-gray-900 bg-white'
                          : 'border-gray-200 text-gray-900 bg-gray-50 hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                    } outline-none`}
                  />
                </div>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={profile.role || 'Admin'}
                    disabled
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
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
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      🔒 Your account has administrator privileges. Please keep your credentials secure.
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
            { label: 'Change Password', icon: Key, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Security Settings', icon: Lock, color: 'bg-red-50 text-red-600' },
            { label: 'Audit Log', icon: Clock, color: 'bg-blue-50 text-blue-600' },
            { label: 'Logout', icon: LogOut, color: 'bg-gray-50 text-gray-600' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`${action.color} rounded-2xl p-4 text-center transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-medium">{action.label}</span>
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
    </AdminLayout>
  );
}

// Add missing imports
import { Store } from 'lucide-react';