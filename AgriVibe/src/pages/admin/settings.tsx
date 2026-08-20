// src/pages/admin/settings.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Truck, 
  Lock, 
  Shield,
  Zap,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  Users,
  Building,
  CreditCard,
  Smartphone,
  Banknote,
  Globe2,
  Cog,
  Sliders,
  Eye,
  EyeOff,
  Bell,
  Hash,
  Percent,
  Ruler,
  Clock as ClockIcon,
  Fingerprint,
  Database,
  Cloud,
  RefreshCw,
  UserCheck,
  Key,
  Server
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'AgriVibe',
    siteDescription: 'Fresh Farm Produce, Delivered to Your Campus',
    contactEmail: 'admin@agrivibe.com',
    contactPhone: '+254700000000',
    siteAddress: 'Nairobi, Kenya',
    
    // Commission Settings
    vendorCommission: 10,
    driverCommission: 0,
    
    // Delivery Settings
    defaultDeliveryFee: 150,
    freeDeliveryThreshold: 1000,
    maxDeliveryDistance: 15,
    
    // Security Settings
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    sessionTimeout: 120,
    
    // Feature Flags
    enableCampus: true,
    enableEscrow: true,
    enableWallet: true,
    enableReviews: true,
    enableAI: false,

    // Platform Payment Details
    platformPaymentMethod: 'mpesa',
    platformMpesaNumber: '254700000000',
    platformBankName: 'Equity Bank',
    platformBankAccount: '1234567890',
    platformAccountHolder: 'AgriVibe KE Farm Solutions',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'commission', label: 'Commission', icon: DollarSign },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'features', label: 'Features', icon: Zap },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
            <p className="text-gray-500 mt-1">Manage platform settings and configurations</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
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
                Edit Settings
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
                <p className="text-xs text-green-600">All configurations have been updated.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== TABS ====== */}
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ====== GENERAL SETTINGS ====== */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500">Basic platform information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Site Name
                  </label>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Site Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Site Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="siteAddress"
                      value={settings.siteAddress}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== COMMISSION SETTINGS ====== */}
          {activeTab === 'commission' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Commission Settings</h2>
                  <p className="text-sm text-gray-500">Platform revenue configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vendor Commission (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="vendorCommission"
                      type="number"
                      value={settings.vendorCommission}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Platform earns this percentage from each sale</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Driver Commission (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="driverCommission"
                      type="number"
                      value={settings.driverCommission}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Platform earns this from delivery fees</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== PAYMENT SETTINGS ====== */}
          {activeTab === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Platform Payment Details</h2>
                  <p className="text-sm text-gray-500">Your payment details for receiving platform commission (10%)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      name="platformPaymentMethod"
                      value={settings.platformPaymentMethod}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 appearance-none ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    >
                      <option value="mpesa">📱 M-Pesa</option>
                      <option value="bank">🏦 Bank Transfer</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {settings.platformPaymentMethod === 'mpesa' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      M-Pesa Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="platformMpesaNumber"
                        placeholder="254700000000"
                        value={settings.platformMpesaNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                          isEditing 
                            ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                        } outline-none`}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Bank Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="platformBankName"
                          placeholder="e.g., Equity Bank"
                          value={settings.platformBankName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                            isEditing 
                              ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                              : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                          } outline-none`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Bank Account Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="platformBankAccount"
                          placeholder="1234567890"
                          value={settings.platformBankAccount}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                            isEditing 
                              ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                              : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                          } outline-none`}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Account Holder Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="platformAccountHolder"
                          placeholder="AgriVibe KE Farm Solutions"
                          value={settings.platformAccountHolder}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                            isEditing 
                              ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                              : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                          } outline-none`}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ====== DELIVERY SETTINGS ====== */}
          {activeTab === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Delivery Settings</h2>
                  <p className="text-sm text-gray-500">Configure delivery options</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Default Delivery Fee (KES)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="defaultDeliveryFee"
                      type="number"
                      value={settings.defaultDeliveryFee}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Free Delivery Threshold (KES)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="freeDeliveryThreshold"
                      type="number"
                      value={settings.freeDeliveryThreshold}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Orders above this amount get free delivery</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Delivery Distance (km)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="maxDeliveryDistance"
                      type="number"
                      value={settings.maxDeliveryDistance}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                          : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                      } outline-none`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== SECURITY SETTINGS ====== */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500">Platform security configuration</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Require 2FA for admin access</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => !isEditing ? null : setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    className={`w-12 h-7 rounded-full transition-all duration-300 ${
                      settings.twoFactorAuth ? 'bg-agrivibe-green' : 'bg-gray-300'
                    } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isEditing}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                      settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Login Attempts
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                          isEditing 
                            ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                        } outline-none`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Session Timeout (minutes)
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                          isEditing 
                            ? 'border-gray-200 bg-white text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10'
                            : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'
                        } outline-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== FEATURE FLAGS ====== */}
          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Feature Flags</h2>
                  <p className="text-sm text-gray-500">Enable or disable platform features</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'enableCampus', label: 'Campus Mode', icon: Building },
                  { key: 'enableEscrow', label: 'Escrow System', icon: Shield },
                  { key: 'enableWallet', label: 'Wallet System', icon: Wallet },
                  { key: 'enableReviews', label: 'Reviews & Ratings', icon: Star },
                  { key: 'enableAI', label: 'AI Assistant', icon: Bot },
                ].map((feature) => {
                  const Icon = feature.icon;
                  const isEnabled = settings[feature.key as keyof typeof settings];
                  return (
                    <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isEnabled ? 'text-agrivibe-green' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => !isEditing ? null : setSettings({ 
                          ...settings, 
                          [feature.key]: !isEnabled
                        })}
                        className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          isEnabled ? 'bg-agrivibe-green' : 'bg-gray-300'
                        } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isEditing}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ====== SAVE BUTTON ====== */}
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save All Settings
                </>
              )}
            </motion.button>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}

// Add missing imports
import { FileText, ChevronDown, User, Wallet, Star, Bot } from 'lucide-react';