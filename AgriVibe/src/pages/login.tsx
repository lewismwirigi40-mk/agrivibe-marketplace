import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PremiumButton from '../components/PremiumButton';
import { login } from '../services/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (!response.ok) setBackendAvailable(false);
      } catch {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(email, password);
      
      // Check user role and redirect accordingly
      if (userData.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData.user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (userData.user.role === 'driver') {
        router.push('/driver/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-1">Login to your AgriVibe account</p>
          </div>

          {!backendAvailable && (
            <div className="bg-yellow-500/20 text-yellow-300 text-sm p-3 rounded-xl border border-yellow-500/30 mb-4">
              ⚠️ Backend server is not running. Please start the backend.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl border border-red-500/30">
                {error}
              </div>
            )}

            <PremiumButton type="submit" variant="primary" size="lg" className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </PremiumButton>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-yellow-400 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}