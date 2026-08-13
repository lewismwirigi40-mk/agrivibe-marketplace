import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PremiumButton from '../components/PremiumButton';
import { register } from '../services/auth';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌾</div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-1">Join AgriVibe today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
              </div>
              <div>
                <input
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number (e.g., 254700000000)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl border border-red-500/30">
                {error}
              </div>
            )}

            <PremiumButton type="submit" variant="primary" size="lg" className="w-full">
              {loading ? 'Creating Account...' : 'Register'}
            </PremiumButton>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}