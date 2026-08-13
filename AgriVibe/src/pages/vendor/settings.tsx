import { useState, useEffect, useRef } from 'react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store Settings
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [isActive, setIsActive] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  
  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/stores/my-store');
      const store = response.data.store;
      if (store) {
        setStoreName(store.store_name || '');
        setStoreDescription(store.description || '');
        setContactEmail(store.contact_email || '');
        setContactPhone(store.contact_phone || '');
        setStoreAddress(store.address || '');
        setDeliveryRadius(store.delivery_radius || 15);
        setIsActive(store.is_active !== false);
        setProfileImage(store.profile_image || '');
        // Payment details
        setPaymentMethod(store.payment_method || 'mpesa');
        setMpesaNumber(store.mpesa_number || '');
        setBankName(store.bank_name || '');
        setBankAccount(store.bank_account || '');
        setAccountHolder(store.account_holder || '');
      }
    } catch (error) {
      console.error('Failed to fetch store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Connect to backend
      alert('Store settings updated successfully!');
    } catch (error) {
      alert('Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="text-center text-gray-400 py-12">Loading settings...</div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Store Settings</h1>
        <p className="text-gray-400 mt-1">Manage your store information</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
        {/* Profile Image - Optional */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400/20 to-green-500/20 border-2 border-yellow-400/30">
              {profileImage ? (
                <img src={profileImage} alt="Store" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-700">
                  {storeName?.charAt(0)?.toUpperCase() || '🏪'}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-yellow-400 text-gray-900 p-1.5 rounded-full text-xs hover:bg-yellow-300 transition"
            >
              📷
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">Optional: Click camera to add store logo</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Store Name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Store Description</label>
          <textarea
            rows={3}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone</label>
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Store Address</label>
          <input
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Delivery Radius (km)</label>
            <input
              type="number"
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Store Status</label>
            <select
              value={isActive ? 'active' : 'inactive'}
              onChange={(e) => setIsActive(e.target.value === 'active')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <h3 className="text-lg font-semibold text-white mb-3">💳 Payment Details</h3>
          <p className="text-gray-400 text-sm mb-3">Where your 90% earnings will be sent</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {paymentMethod === 'mpesa' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">M-Pesa Number *</label>
                <input
                  placeholder="254700000000"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                />
                <p className="text-gray-500 text-xs mt-1">Your earnings will be sent to this M-Pesa number</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Name *</label>
                  <input
                    placeholder="e.g., Equity Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Account Number *</label>
                  <input
                    placeholder="1234567890"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Holder Name *</label>
                  <input
                    placeholder="Full name on the bank account"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </VendorLayout>
  );
}