// src/pages/guides/index.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  Star,
  Users,
  ArrowRight,
  Grid,
  List,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Download,
  Lock,
  Unlock
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function Guides() {
  const [guides, setGuides] = useState<any[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await api.get('/guides');
      const guidesData = response.data.guides || [];
      setGuides(guidesData);
      setFilteredGuides(guidesData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(guidesData.map((g: any) => g.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort guides
  useEffect(() => {
    let result = [...guides];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(guide => guide.category === categoryFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.purchases || 0) - (a.purchases || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredGuides(result);
  }, [searchTerm, categoryFilter, sortBy, guides]);

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'farming': 'from-green-500 to-emerald-500',
      'business': 'from-blue-500 to-blue-600',
      'technology': 'from-purple-500 to-purple-600',
      'marketing': 'from-pink-500 to-pink-600',
      'finance': 'from-yellow-500 to-orange-500',
      'sustainability': 'from-teal-500 to-teal-600',
    };
    return colors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-light">
        <Navbar />
        <div className="container-premium pt-32 pb-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading guides...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-light overflow-x-hidden">
      <Navbar />

      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-agrivibe-green/95 via-emerald-900/90 to-teal-900/95" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>

        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 shadow-2xl mb-6">
              <BookOpen className="w-5 h-5 text-agrivibe-gold" />
              Expert Knowledge
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
              AgriVibe <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">Guides</span>
            </h1>
            <p className="text-xl text-white/80">
              Expert guides from AgriVibe KE Farm Solutions to help you grow your agribusiness
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== FILTERS SECTION ====== */}
      <div className="container-premium -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-agrivibe-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-agrivibe-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}
          </div>
        </motion.div>
      </div>

      {/* ====== GUIDES GRID ====== */}
      <div className="container-premium py-12">
        {filteredGuides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No guides found</h3>
            <p className="text-gray-500 text-lg">
              {searchTerm || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'No guides available yet'}
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            <AnimatePresence>
              {filteredGuides.map((guide: any, index: number) => {
                const categoryColor = getCategoryColor(guide.category);
                
                return (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className={`group ${viewMode === 'grid' ? '' : 'flex'}`}
                  >
                    <Link href={`/guides/${guide.slug}`} className="block w-full">
                      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex' : ''}`}>
                        {/* Cover Image */}
                        <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-56' : 'h-48 w-56 flex-shrink-0'}`}>
                          {guide.cover_image ? (
                            <img 
                              src={guide.cover_image} 
                              alt={guide.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-agrivibe-green/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            {guide.is_featured && (
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                ⭐ Featured
                              </span>
                            )}
                            {guide.category && (
                              <span className={`bg-gradient-to-r ${categoryColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                                {guide.category}
                              </span>
                            )}
                          </div>

                          {/* Price Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                            <span className="text-lg font-bold text-yellow-400">{formatCurrency(guide.price)}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`flex-1 p-5 ${viewMode === 'list' ? 'flex flex-col justify-center' : ''}`}>
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-agrivibe-green transition-colors">
                            {guide.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {guide.description}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(guide.created_at).toLocaleDateString()}</span>
                            </div>
                            {guide.purchases > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <span>{guide.purchases} purchased</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {guide.is_purchased ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                  <Unlock className="w-3 h-3" />
                                  Owned
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                  <Lock className="w-3 h-3" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Wishlist functionality
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Share functionality
                                }}
                                className="p-1.5 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white text-xs font-semibold rounded-lg group-hover:shadow-lg group-hover:shadow-agrivibe-green/30 transition-all duration-300">
                                View
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ====== CTA SECTION ====== */}
      <section className="py-16 bg-gradient-to-r from-agrivibe-green to-emerald-600">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to share your expertise?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Become a guide contributor and help others grow their agribusiness
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 bg-white text-agrivibe-green px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Become a Contributor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== BACK TO TOP ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowRight className="w-5 h-5 -rotate-90" />
      </button>
    </div>
  );
}