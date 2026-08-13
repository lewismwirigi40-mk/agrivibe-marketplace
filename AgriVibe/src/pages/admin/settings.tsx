import AdminLayout from '../../components/AdminLayout';
import { useState } from 'react';

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
      alert('Settings saved successfully!');
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>
          <p className="text-gray-400 mt-1">Manage platform settings and configurations</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          {isEditing ? 'Cancel' : 'Edit Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* General Settings */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🏢 General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Site Name</label>
              <input
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Site Description</label>
              <input
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contact Email</label>
              <input
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone</label>
              <input
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Site Address</label>
              <input
                name="siteAddress"
                value={settings.siteAddress}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">💰 Commission Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Commission (%)</label>
              <input
                name="vendorCommission"
                type="number"
                value={settings.vendorCommission}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
              <p className="text-gray-500 text-xs mt-1">Platform earns this percentage from each sale</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Driver Commission (%)</label>
              <input
                name="driverCommission"
                type="number"
                value={settings.driverCommission}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
              <p className="text-gray-500 text-xs mt-1">Platform earns this from delivery fees</p>
            </div>
          </div>
        </div>

        {/* Platform Payment Details */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🏦 Platform Payment Details</h2>
          <p className="text-gray-400 text-sm mb-3">Your payment details for receiving platform commission (10%)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                name="platformPaymentMethod"
                value={settings.platformPaymentMethod}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {settings.platformPaymentMethod === 'mpesa' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">M-Pesa Number</label>
                <input
                  name="platformMpesaNumber"
                  placeholder="254700000000"
                  value={settings.platformMpesaNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                  } outline-none transition`}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
                  <input
                    name="platformBankName"
                    placeholder="e.g., Equity Bank"
                    value={settings.platformBankName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                    } outline-none transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Account Number</label>
                  <input
                    name="platformBankAccount"
                    placeholder="1234567890"
                    value={settings.platformBankAccount}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                    } outline-none transition`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Holder Name</label>
                  <input
                    name="platformAccountHolder"
                    placeholder="AgriVibe KE Farm Solutions"
                    value={settings.platformAccountHolder}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                    } outline-none transition`}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🚚 Delivery Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Default Delivery Fee (KES)</label>
              <input
                name="defaultDeliveryFee"
                type="number"
                value={settings.defaultDeliveryFee}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Free Delivery Threshold (KES)</label>
              <input
                name="freeDeliveryThreshold"
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
              <p className="text-gray-500 text-xs mt-1">Orders above this amount get free delivery</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Delivery Distance (km)</label>
              <input
                name="maxDeliveryDistance"
                type="number"
                value={settings.maxDeliveryDistance}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🔒 Security Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Two-Factor Authentication</span>
              <button
                type="button"
                onClick={() => !isEditing ? null : setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                className={`w-12 h-6 rounded-full transition ${
                  settings.twoFactorAuth ? 'bg-yellow-400' : 'bg-gray-600'
                } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                disabled={!isEditing}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Login Attempts</label>
              <input
                name="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Session Timeout (minutes)</label>
              <input
                name="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">⚡ Feature Flags</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'enableCampus', label: 'Campus Mode' },
              { key: 'enableEscrow', label: 'Escrow System' },
              { key: 'enableWallet', label: 'Wallet System' },
              { key: 'enableReviews', label: 'Reviews & Ratings' },
              { key: 'enableAI', label: 'AI Assistant' },
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300 text-sm">{feature.label}</span>
                <button
                  type="button"
                  onClick={() => !isEditing ? null : setSettings({ 
                    ...settings, 
                    [feature.key]: !settings[feature.key as keyof typeof settings] 
                  })}
                  className={`w-10 h-5 rounded-full transition ${
                    settings[feature.key as keyof typeof settings] ? 'bg-yellow-400' : 'bg-gray-600'
                  } ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!isEditing}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition transform ${
                    settings[feature.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        )}
      </form>
    </AdminLayout>
  );
}