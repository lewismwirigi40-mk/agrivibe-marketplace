import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  TrendingUp, 
  Shield, 
  Truck, 
  Star, 
  ChevronRight,
  Search,
  Menu,
  X,
  User,
  Sparkles,
  ArrowRight,
  Leaf, // ✅ Add this
} from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const containerRef = useRef(null);
  
  // REAL DATA STATES
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalVendors: 0,
    totalCampuses: 0,
    satisfaction: 0
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // FETCH REAL DATA
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const productsRes = await api.get('/products?limit=4');
      setProducts(productsRes.data.products || []);
      
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data.categories || []);
      
      const statsRes = await api.get('/admin/dashboard');
      const statsData = statsRes.data.stats || {};
      setStats({
        totalProducts: statsData.totalProducts || 0,
        totalVendors: statsData.totalVendors || 0,
        totalCampuses: statsData.totalCampuses || 0,
        satisfaction: statsData.satisfaction || 95
      });
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // REAL ADD TO CART FUNCTION - REDIRECTS TO MARKETPLACE
  const handleAddToCart = (productId: string) => {
    // If user is not logged in, redirect to login
    // For now, redirect to marketplace with product in URL
    router.push(`/marketplace?add=${productId}`);
  };

  // OR - If you want to show notification and then redirect
  const handleAddToCartWithNotification = (productId: string) => {
    setNotificationMessage('✅ Product added to cart!');
    setShowCartNotification(true);
    
    // After showing notification, redirect to marketplace
    setTimeout(() => {
      setShowCartNotification(false);
      router.push('/marketplace');
    }, 1500);
  };

  // REAL SEARCH FUNCTION
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/marketplace');
    }
  };

  // REAL CATEGORY CLICK - Redirect to marketplace with category filter
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };

  // REAL PRODUCT CLICK - Redirect to product detail
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-gray-800">🌾 AgriVibe</div>
          <div className="text-gray-500 mt-2">Loading fresh produce...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ====== NAVBAR ====== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-xl">🌾</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgriVibe
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search for fresh produce..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2.5 rounded-full border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50/80"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <Link href="/marketplace" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Marketplace</Link>
              <Link href="/guides" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Guides</Link>
              <Link href="/vendor/register" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Sell</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors">About</Link>
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for fresh produce..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                  <button type="submit" className="absolute right-3 top-3 text-gray-400">
                    <Search className="w-5 h-5" />
                  </button>
                </form>
                <Link href="/marketplace" className="block text-gray-700 hover:text-green-600 font-medium">Marketplace</Link>
                <Link href="/guides" className="block text-gray-700 hover:text-green-600 font-medium">Guides</Link>
                <Link href="/vendor/register" className="block text-gray-700 hover:text-green-600 font-medium">Sell</Link>
                <Link href="/about" className="block text-gray-700 hover:text-green-600 font-medium">About</Link>
                <Link 
                  href="/login" 
                  className="block text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ====== HERO SECTION ====== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Fresh farm produce" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-emerald-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-green-400/30 mb-6">
                <Sparkles className="w-4 h-4" />
                🌱 Fresh from the Farm — Direct to You
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Fresh From Farms.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400">
                Delivered to Your Campus.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed"
            >
              Buy directly from verified vendors and local farmers with secure payments and last-mile delivery across all Kenyan universities.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/marketplace" 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/vendor/register" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5" />
                Become a Vendor
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-8 mt-12"
            >
              {[
                { icon: Shield, label: 'Secure Payments' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: Star, label: 'Quality Guarantee' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80">
                  <item.icon className="w-5 h-5 text-yellow-400" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ====== STATS SECTION ====== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: stats.totalProducts || '10K+', label: 'Products Available' },
              { number: stats.totalVendors || '500+', label: 'Verified Vendors' },
              { number: stats.totalCampuses || '22', label: 'Campuses' },
              { number: stats.satisfaction || '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CATEGORIES SECTION ====== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Leaf className="w-4 h-4" />
              Browse by Category
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Find What You're Looking For
            </h2>
            <p className="text-gray-600 mt-2">Explore our diverse range of fresh produce</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon || '📦'}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count || `${Math.floor(Math.random() * 100)}+`}</p>
                </motion.div>
              ))
            ) : (
              // Fallback categories if API returns empty
              ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Grains', 'Organic'].map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleCategoryClick(name)}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {['🥬', '🍎', '🥩', '🥛', '🌾', '🫐'][index]}
                  </div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Featured Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Handpicked Fresh Produce
              </h2>
            </div>
            <Link 
              href="/marketplace" 
              className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12 }}
                  onClick={() => handleProductClick(product.id)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image || product.cover_image || 'https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=600&h=400&fit=crop'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-lg">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(Math.round(product.rating || 4.5))}
                      </div>
                      <span className="text-sm text-gray-500">({product.rating || 4.5})</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{product.vendor || 'Vendor'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">KES {product.price}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty state - redirect to marketplace
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see products here</p>
              <Link 
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Go to Marketplace
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-emerald-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-white/80 text-sm font-semibold uppercase tracking-wider mb-4 border border-white/20 px-4 py-2 rounded-full">
              🚀 Stay Updated
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Subscribe to <span className="text-yellow-400">AgriVibe</span>
            </h2>
            <p className="text-green-100 mb-6">Get the latest deals, new products, and campus updates delivered to your inbox</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                router.push('/marketplace');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 outline-none text-gray-800 placeholder-gray-400"
                required
              />
              <button 
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/30"
              >
                Subscribe
              </button>
            </form>
            <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-bold">AgriVibe</span>
              </div>
              <p className="text-gray-400 text-sm">Connecting farmers, vendors, and students across Kenyan campuses.</p>
              <div className="flex gap-4 mt-4">
               <div className="flex gap-4 mt-4">
  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Facebook</a>
  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Instagram</a>
  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">YouTube</a>
</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Notification */}
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}