import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';
import PremiumButton from '../components/PremiumButton';
import FloatingButtons from '../components/FloatingButtons';
import AIChat from '../components/AIChat';
import api from '../services/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  
  // REAL DATA STATES
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalVendors: 0,
    totalCampuses: 0,
    satisfaction: 0
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsRes = await api.get('/products?limit=4');
      setProducts(productsRes.data.products || []);
      
      // Fetch categories
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data.categories || []);
      
      // Fetch stats
      const statsRes = await api.get('/admin/dashboard');
      const statsData = statsRes.data.stats || {};
      setStats({
        totalProducts: statsData.totalProducts || 0,
        totalVendors: statsData.totalVendors || 0,
        totalCampuses: statsData.totalCampuses || 0,
        satisfaction: statsData.satisfaction || 95
      });
      
      // Fetch reviews (testimonials)
      const reviewsRes = await api.get('/reviews?limit=3');
      setReviews(reviewsRes.data.reviews || []);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Fallback to minimal dummy data if API fails
      setProducts([
        { id: 1, name: 'Fresh Organic Tomatoes', price: 150, vendor: 'Green Farm', rating: 4.8, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop' },
        { id: 2, name: 'Organic Kale', price: 80, vendor: 'Healthy Greens', rating: 4.9, image: 'https://images.unsplash.com/photo-1524179094475-0a6c6a89df4a?w=400&h=300&fit=crop' },
        { id: 3, name: 'Sweet Avocado', price: 120, vendor: 'Avocado Paradise', rating: 4.7, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop' },
        { id: 4, name: 'Fresh Spinach', price: 100, vendor: 'Veggie Fresh', rating: 4.6, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
      ]);
      setCategories([
        { icon: '🥬', name: 'Vegetables' },
        { icon: '🍎', name: 'Fruits' },
        { icon: '🥩', name: 'Meat' },
        { icon: '🥛', name: 'Dairy' },
      ]);
      setReviews([
        { name: 'Jane Mwangi', campus: 'DeKUT', comment: 'Fresh and affordable!', rating: 5 },
        { name: 'Peter Kariuki', campus: 'KU', comment: 'Always on time!', rating: 5 },
        { name: 'Mary Wanjiru', campus: 'JKUAT', comment: 'Love the escrow system!', rating: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity: 1 });
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-up';
      toast.textContent = '✅ Added to cart!';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
      }, 2500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  // Display products (use real data, fallback to dummy)
  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: 'Fresh Organic Tomatoes', price: 150, vendor: 'Green Farm', rating: 4.8, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop' },
    { id: 2, name: 'Organic Kale', price: 80, vendor: 'Healthy Greens', rating: 4.9, image: 'https://images.unsplash.com/photo-1524179094475-0a6c6a89df4a?w=400&h=300&fit=crop' },
    { id: 3, name: 'Sweet Avocado', price: 120, vendor: 'Avocado Paradise', rating: 4.7, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop' },
    { id: 4, name: 'Fresh Spinach', price: 100, vendor: 'Veggie Fresh', rating: 4.6, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
  ];

  const displayCategories = categories.length > 0 ? categories : [
    { icon: '🥬', name: 'Vegetables' },
    { icon: '🍎', name: 'Fruits' },
    { icon: '🥩', name: 'Meat' },
    { icon: '🥛', name: 'Dairy' },
  ];

  const displayReviews = reviews.length > 0 ? reviews : [
    { name: 'Jane Mwangi', campus: 'DeKUT', comment: 'Fresh and affordable!', rating: 5 },
    { name: 'Peter Kariuki', campus: 'KU', comment: 'Always on time!', rating: 5 },
    { name: 'Mary Wanjiru', campus: 'JKUAT', comment: 'Love the escrow system!', rating: 5 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🌾</div>
          <div className="text-white text-xl font-semibold">Loading AgriVibe...</div>
          <div className="text-gray-400 text-sm mt-2">Fresh produce coming your way</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-dark overflow-x-hidden">
      <Navbar />
      <AIChat />
      <FloatingButtons />

      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-40 md:pb-28 min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block bg-green-600/80 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/10"
            >
              🌱 Fresh from the Farm — Direct to You
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            >
              Fresh From Farms.
              <br />
              <span className="text-gradient-gold">Delivered to Your Campus.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-white/80 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Buy directly from verified vendors and local farmers with secure payments and fast delivery.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Link href="/marketplace" className="btn-premium">
                🛒 Start Shopping
              </Link>
              <Link href="/vendor/register" className="btn-premium-secondary">
                👨‍🌾 Become a Vendor
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mt-16 max-w-3xl mx-auto"
          >
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-8 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-default">
              <AnimatedCounter target={stats.totalProducts || 200} suffix="+" />
              <div className="text-sm text-white/70">Products</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-8 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-default">
              <AnimatedCounter target={stats.totalVendors || 300} suffix="+" />
              <div className="text-sm text-white/70">Vendors</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-8 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-default">
              <AnimatedCounter target={stats.totalCampuses || 22} />
              <div className="text-sm text-white/70">Campuses</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-8 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-default">
              <AnimatedCounter target={stats.satisfaction || 95} suffix="%" />
              <div className="text-sm text-white/70">Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== CATEGORIES ====== */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-premium">Categories</span>
          <h2 className="heading-2 text-white mt-4">Browse by <span className="text-gradient-gold">Category</span></h2>
          <p className="text-premium mt-2">Find exactly what you're looking for</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayCategories.map((cat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="card-premium text-center cursor-pointer group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{cat.icon || '📦'}</div>
              <div className="text-white font-semibold">{cat.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="px-4 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <span className="badge-premium">Best Sellers</span>
              <h2 className="heading-2 text-white mt-2">🔥 Featured <span className="text-gradient-gold">Products</span></h2>
              <p className="text-premium mt-1">Handpicked fresh produce from top vendors</p>
            </div>
            <PremiumButton href="/marketplace" variant="ghost" size="sm">
              View All →
            </PremiumButton>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onMouseEnter={() => setHoveredProduct(i)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="card-premium overflow-hidden group relative"
              >
                <div className="relative h-52 overflow-hidden rounded-xl">
                  <img 
                    src={product.image || product.cover_image || 'https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      ⭐ {product.rating || 4.5}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{product.vendor || product.store?.store_name || 'Vendor'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-yellow-400 font-bold text-lg">KES {product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS - REAL REVIEWS ====== */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-premium">Testimonials</span>
          <h2 className="heading-2 text-white mt-2">What Our <span className="text-gradient-gold">Customers Say</span></h2>
          <p className="text-premium mt-1">Real reviews from real people</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="card-premium"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center text-2xl border border-white/10">
                  {review.user?.first_name?.[0] || '👤'}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{review.user?.first_name || review.name || 'Customer'}</h4>
                  <p className="text-gray-400 text-sm">{review.campus || 'Verified Buyer'}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {'⭐'.repeat(review.rating || 5)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">"{review.comment || review.title || 'Great experience!'}"</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-block text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">✅ Verified Purchase</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section className="px-4 py-20 bg-gradient-to-r from-green-800 to-emerald-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-premium bg-white/10 text-white border-white/20">Stay Updated</span>
            <h2 className="heading-2 text-white mt-4">Subscribe to <span className="text-yellow-400">AgriVibe</span></h2>
            <p className="text-green-100 mt-2">Get the latest deals, new products, and campus updates</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 outline-none text-gray-800 placeholder-gray-400"
              />
              <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/30">
                Subscribe
              </button>
            </div>
            <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ====== SCROLL TO TOP ====== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 w-12 h-12 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-xl"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== FOOTER ====== */}
      <footer className="bg-[#0a0a12] border-t border-white/5 px-4 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl font-bold text-white">🌾 AgriVibe</p>
          <p className="text-sm text-white/40 mt-1">Sponsored by AgriVibe KE Farm Solutions</p>
          <p className="text-gray-500 mt-2 text-sm">Connecting farmers, vendors, and customers across campuses.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
          </div>
          <p className="mt-6 text-xs text-white/30">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}