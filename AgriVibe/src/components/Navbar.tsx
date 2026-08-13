import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
            <span>🌾</span>
            <span className="hidden sm:inline">AgriVibe</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, vendors, categories..."
                className="w-full px-4 py-2.5 pl-10 bg-gray-100 rounded-full border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/marketplace" className="text-gray-600 hover:text-green-600 transition text-sm font-medium">
              Marketplace
            </Link>
            
            <Link href="/vendor/register" className="text-gray-600 hover:text-green-600 transition text-sm font-medium">
              Sell
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-green-600 transition text-sm font-medium">
              🛒 <span className="hidden lg:inline">Cart</span>
            </Link>
            <Link href="/guides" className="text-gray-600 hover:text-green-600 transition text-sm font-medium">
              Guides
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-gray-600 hover:text-green-600 transition text-sm font-medium px-3 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:border-green-500 outline-none"
            />
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600 transition py-1" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
            <Link href="/guides" className="text-gray-700 hover:text-green-600 transition py-1" onClick={() => setIsMenuOpen(false)}>
              Guides
            </Link>
            <Link href="/vendor/register" className="text-gray-700 hover:text-green-600 transition py-1" onClick={() => setIsMenuOpen(false)}>
              Become a Vendor
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-green-600 transition py-1" onClick={() => setIsMenuOpen(false)}>
              🛒 Cart
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="bg-green-600 text-white text-center px-4 py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-500 text-left py-1">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition py-1" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="bg-green-600 text-white text-center px-4 py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

