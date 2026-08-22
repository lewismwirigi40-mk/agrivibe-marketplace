// src/pages/dashboard/settings.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Bell, 
  Mail, 
  Smartphone, 
  Lock, 
  Shield, 
  Moon, 
  Sun,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Eye,
  EyeOff,
  Key,
  User,
  LogOut,
  Trash2,
  Globe,
  Clock,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    darkMode: true,
    twoFactorAuth: false,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setPasswordError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowDeleteModal(false);
      // Redirect to logout
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account preferences</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
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
                <p className="text-sm font-medium text-green-700">Settings saved successfully!</p>
                <p className="text-xs text-green-600">Your preferences have been updated.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== SETTINGS GRID ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ====== NOTIFICATIONS ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Manage how you receive updates</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, description: 'Receive updates via email' },
                { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone, description: 'Receive updates via SMS' },
                { key: 'pushNotifications', label: 'Push Notifications', icon: Bell, description: 'Receive updates on your device' },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = settings[item.key as keyof typeof settings];
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key as keyof typeof settings)}
                      className={`w-12 h-7 rounded-full transition-all duration-300 ${isEnabled ? 'bg-agrivibe-green' : 'bg-gray-300'}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ====== SECURITY ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">Protect your account</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${settings.twoFactorAuth ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('twoFactorAuth')}
                  className={`w-12 h-7 rounded-full transition-all duration-300 ${settings.twoFactorAuth ? 'bg-agrivibe-green' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Change Password */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">Update your password</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-agrivibe-green transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ====== ACCOUNT MANAGEMENT ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Account Management</h2>
              <p className="text-sm text-gray-500">Manage your account settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Language & Region</p>
                  <p className="text-xs text-gray-500">Change your language preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">English</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-agrivibe-green transition-colors" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Timezone</p>
                  <p className="text-xs text-gray-500">Set your local timezone</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">EAT (UTC+3)</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-agrivibe-green transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* ====== DANGER ZONE ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
              <p className="text-sm text-gray-500">Permanent actions that cannot be undone</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors border border-red-200"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ⚠️ Deleting your account will permanently remove all your data.
          </p>
        </motion.div>
      </div>

      {/* ====== CHANGE PASSWORD MODAL ====== */}
      <AnimatePresence>
        {showPasswordModal && (
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
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Change Password</h2>
                      <p className="text-white/80 text-sm">Update your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {passwordSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Password Updated!</h3>
                    <p className="text-gray-500 mt-1">Your password has been changed successfully.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{passwordError}</span>
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DELETE ACCOUNT MODAL ====== */}
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
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Delete Account</h2>
                      <p className="text-white/80 text-sm">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    This will permanently delete your account and all associated data. 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Yes, Delete Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}