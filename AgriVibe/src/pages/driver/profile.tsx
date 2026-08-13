import { useState, useEffect, useRef } from 'react';
import DriverLayout from '../../components/DriverLayout';
import api from '../../services/api';

export default function DriverProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicle: '',
    plateNumber: '',
    address: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
        vehicle: user.vehicle || 'Motorcycle',
        plateNumber: user.plate_number || '',
        address: user.address || '',
        profileImage: user.profile_image || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({ ...profile, profileImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="text-center text-gray-400 py-12">Loading profile...</div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your personal and vehicle information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        {/* Profile Image - Optional */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400/20 to-green-500/20 border-2 border-yellow-400/30">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-700">
                  {profile.firstName?.charAt(0)?.toUpperCase() || '🚚'}
                </div>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-yellow-400 text-gray-900 p-1.5 rounded-full text-xs hover:bg-yellow-300 transition"
              >
                📷
              </button>
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
            <p className="text-gray-400 text-xs mt-2">Optional: Click camera to add photo</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle</label>
              <input
                name="vehicle"
                value={profile.vehicle}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Plate Number</label>
              <input
                name="plateNumber"
                value={profile.plateNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
              <input
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isEditing ? 'border-yellow-400/50 bg-white/10 text-white' : 'border-white/10 bg-transparent text-gray-400'
                } outline-none transition`}
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={saving}
              className="mt-6 bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>
    </DriverLayout>
  );
}