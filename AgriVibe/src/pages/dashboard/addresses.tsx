import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function Addresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: '',
    address: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // TODO: Replace with real addresses endpoint
      // For now, using placeholder data
      setAddresses([
        { id: '1', label: 'Home', address: '123 Main Street, Nairobi', phone: '254700000001', isDefault: true },
        { id: '2', label: 'Campus', address: 'DeKUT, Nyeri', phone: '254700000002', isDefault: false },
      ]);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend
    alert('Address saved!');
    setShowForm(false);
    setEditing(null);
    setFormData({ label: '', address: '', phone: '', isDefault: false });
    await fetchAddresses();
  };

  const setDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id: string) => {
    if (!confirm('Delete this address?')) return;
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-12">Loading addresses...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Addresses</h1>
          <p className="text-gray-400 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ label: '', address: '', phone: '', isDefault: false });
            setShowForm(true);
          }}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          + Add New Address
        </button>
      </div>

      {showForm && (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{editing ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="label"
              placeholder="Label (e.g., Home, Campus)"
              value={formData.label}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-5 h-5 accent-yellow-400"
              />
              <label className="text-gray-300">Set as default address</label>
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
              {editing ? 'Update Address' : 'Add Address'}
            </button>
          </form>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{addr.label}</h3>
                  {addr.isDefault && (
                    <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-gray-300 mt-2">{addr.address}</p>
                <p className="text-gray-400 text-sm mt-1">📞 {addr.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(addr);
                    setFormData(addr);
                    setShowForm(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm transition"
                >
                  ✏️
                </button>
                <button onClick={() => deleteAddress(addr.id)} className="text-red-400 hover:text-red-300 text-sm transition">
                  🗑️
                </button>
              </div>
            </div>
            {!addr.isDefault && (
              <button
                onClick={() => setDefault(addr.id)}
                className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm transition"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}