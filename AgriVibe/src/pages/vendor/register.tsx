import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import PremiumButton from '../../components/PremiumButton';

export default function VendorRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    // Store Info
    storeName: '',
    storeDescription: '',
    category: '',
    // Addresses
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    // Payment Details
    paymentMethod: 'mpesa',
    mpesaNumber: '',
    bankName: '',
    bankAccount: '',
    // Profile Image
    profileImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Will connect to backend later
    setTimeout(() => {
      setLoading(false);
      router.push('/vendor/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-3xl mx-auto pb-16">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Become a <span className="text-yellow-400">Vendor</span></h1>
            <p className="text-gray-400 mt-2">Complete all steps to start selling</p>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-1 rounded-full transition ${
                    s === step ? 'bg-yellow-400' : s < step ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone Number * (e.g., 254700000000)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
                  Next →
                </button>
              </div>
            )}

            {/* STEP 2: Store Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Store Information</h2>
                <input
                  name="storeName"
                  placeholder="Store Name *"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <textarea
                  name="storeDescription"
                  placeholder="Store Description *"
                  rows={4}
                  value={formData.storeDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="meat">Meat</option>
                  <option value="dairy">Dairy</option>
                  <option value="bakery">Bakery</option>
                  <option value="poultry">Poultry</option>
                  <option value="fish">Fish</option>
                  <option value="cereals">Cereals</option>
                </select>
                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">
                    ← Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Addresses */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Store Address</h2>
                <input
                  name="addressLine1"
                  placeholder="Address Line 1 *"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
                <input
                  name="addressLine2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                  <input
                    name="county"
                    placeholder="County *"
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">
                    ← Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Details */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Payment Details</h2>
                <p className="text-gray-400 text-sm">This is where your 90% earnings will be sent</p>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                </select>

                {formData.paymentMethod === 'mpesa' ? (
                  <input
                    name="mpesaNumber"
                    placeholder="M-Pesa Number * (e.g., 254700000000)"
                    value={formData.mpesaNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                ) : (
                  <>
                    <input
                      name="bankName"
                      placeholder="Bank Name *"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                      required
                    />
                    <input
                      name="bankAccount"
                      placeholder="Bank Account Number *"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                      required
                    />
                  </>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Register Store'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}