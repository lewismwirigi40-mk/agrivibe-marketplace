// src/pages/about.tsx
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Sparkles,
  Shield,
  Award,
  TrendingUp,
  Leaf,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Truck,
  Star,
  Clock,
  Globe,
  Lightbulb,
  Handshake,
  Recycle,
  Zap
} from 'lucide-react';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  const values = [
    { icon: Shield, title: 'Integrity', desc: 'We operate with honesty, transparency, and accountability.', color: 'from-blue-500 to-blue-600' },
    { icon: Lightbulb, title: 'Innovation', desc: 'We embrace technology to solve real-world agricultural challenges.', color: 'from-yellow-500 to-orange-500' },
    { icon: Award, title: 'Quality', desc: 'We are committed to delivering products and services that exceed expectations.', color: 'from-purple-500 to-purple-600' },
    { icon: Heart, title: 'Customer Focus', desc: 'Every decision is centered around creating exceptional experiences.', color: 'from-red-500 to-red-600' },
    { icon: Recycle, title: 'Sustainability', desc: 'We support environmentally responsible practices and community growth.', color: 'from-green-500 to-emerald-500' },
    { icon: Handshake, title: 'Collaboration', desc: 'Strong partnerships create stronger communities and businesses.', color: 'from-indigo-500 to-indigo-600' },
  ];

  const stats = [
    { number: '50+', label: 'Vendors', icon: Users },
    { number: '200+', label: 'Products', icon: Leaf },
    { number: '22', label: 'Campuses', icon: Globe },
    { number: '98%', label: 'Satisfaction', icon: Star },
  ];

  const features = [
    'Fresh, high-quality agricultural products',
    'Competitive and transparent pricing',
    'Verified vendors and trusted suppliers',
    'Secure online shopping with escrow',
    'Convenient order management',
    'Reliable delivery verification',
    '24/7 customer support',
    'Continuous innovation and improvement',
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-premium-light overflow-x-hidden">
      {/* ====== HERO SECTION ====== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[60vh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-agrivibe-green/95 via-emerald-900/90 to-teal-900/95" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
        </div>

        {/* Floating Particles - Temporarily disabled for build */}
{/* <div className="absolute inset-0 overflow-hidden">
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
</div> */}

        <div className="container-premium relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 shadow-2xl mb-6">
              <Sparkles className="w-5 h-5 text-agrivibe-gold" />
              About AgriVibe
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Transforming Agriculture
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                Through Technology
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              AgriVibe Marketplace is revolutionizing how Kenyans access fresh agricultural products through innovative digital solutions.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/40 text-sm flex flex-col items-center gap-2"
          >
            <span>Learn more</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ====== STATS SECTION ====== */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-agrivibe-green/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-agrivibe-green" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== WHO WE ARE ====== */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Users className="w-4 h-4" />
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Powered by <span className="text-gradient-green">AgriVibe KE Farm Solutions</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                AgriVibe Marketplace is proudly developed and operated by <strong className="text-agrivibe-green">AgriVibe KE Farm Solutions</strong>, an innovative agribusiness and technology company committed to modernizing agricultural commerce through digital solutions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that technology has the power to eliminate unnecessary barriers between producers and consumers. By connecting farmers, vendors, wholesalers, and customers on one trusted platform, we create a transparent marketplace where quality products, fair pricing, and reliable service come together.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Trusted Platform
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verified Vendors
                </span>
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Secure Payments
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Eye, label: 'Vision', value: 'Kenya\'s most trusted agricultural marketplace' },
                { icon: Target, label: 'Mission', value: 'Simplify agricultural commerce through technology' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`p-6 rounded-2xl border ${index === 0 ? 'bg-gradient-to-br from-agrivibe-green/5 to-emerald-500/5 border-agrivibe-green/20' : 'bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${index === 0 ? 'bg-agrivibe-green/10' : 'bg-yellow-500/10'}`}>
                      <Icon className={`w-5 h-5 ${index === 0 ? 'text-agrivibe-green' : 'text-yellow-500'}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{item.label}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.value}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== WHAT WE DO ====== */}
      <section className="py-20 bg-premium-light">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Leaf className="w-4 h-4" />
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Connecting <span className="text-gradient-green">Farmers to Customers</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">For Customers</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse fresh produce, compare prices, place secure orders, and enjoy convenient delivery. Access a diverse network of verified vendors offering quality agricultural products.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">For Vendors</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage products, process orders, monitor sales, and grow your business with digital tools designed for agricultural commerce success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              What Makes <span className="text-gradient-green">AgriVibe Different</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-agrivibe-green/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-agrivibe-green group-hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-agrivibe-green group-hover:text-white transition-colors" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== OUR VALUES ====== */}
      <section className="py-20 bg-premium-light">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              What We <span className="text-gradient-green">Stand For</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{value.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== SUPPORTING FARMERS ====== */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
                <Leaf className="w-4 h-4" />
                Supporting Farmers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                Empowering <span className="text-gradient-green">Local Communities</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mt-4">
                Every purchase made through AgriVibe Marketplace contributes to strengthening Kenya's agricultural economy. By providing farmers and local businesses with access to a wider customer base, we help create sustainable income opportunities while encouraging responsible agricultural practices and community development.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 border-2 border-white flex items-center justify-center text-sm font-bold text-agrivibe-green">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500">Join 50+ farmers already on AgriVibe</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-agrivibe-green/5 to-emerald-500/5 rounded-3xl border border-agrivibe-green/20 p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🌾</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Support Local Farmers</p>
                    <p className="text-xs text-gray-500">Every purchase supports Kenyan agriculture</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">📦</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Fresh Produce</p>
                    <p className="text-xs text-gray-500">Quality products from farm to table</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">🌱</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Sustainable Growth</p>
                    <p className="text-xs text-gray-500">Building a better agricultural future</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== INNOVATION ====== */}
      <section className="py-20 bg-premium-light">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Innovation Through Technology
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Building the <span className="text-gradient-green">Future of Agriculture</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              AgriVibe Marketplace leverages modern digital technologies to simplify agricultural trade. From intelligent product management and secure payment integrations to delivery verification and real-time order tracking, our platform is designed to provide a seamless experience for customers and vendors alike.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              As technology evolves, we remain committed to introducing new features that improve efficiency, enhance security, and create greater value for our growing community.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">🔒 Secure Payments</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">📱 Mobile Friendly</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">🚚 Real-time Tracking</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">💬 24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== LOOKING AHEAD ====== */}
      <section className="py-20 bg-gradient-to-r from-agrivibe-green to-emerald-600 text-white">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <TrendingUp className="w-4 h-4" />
              Looking Ahead
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              The Future of <span className="text-yellow-300">Agricultural Commerce</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
              As AgriVibe Marketplace continues to grow, we remain dedicated to building a smarter, more connected agricultural ecosystem where technology empowers farmers, strengthens local businesses, and makes fresh food more accessible to every Kenyan.
            </p>
            <p className="text-white/70 mt-4">
              Our journey is driven by continuous innovation, trusted partnerships, and a commitment to creating lasting value for everyone we serve.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-8 bg-white text-agrivibe-green px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <div className="bg-gray-900 py-8">
        <div className="container-premium text-center">
          <p className="text-white font-semibold text-lg">🌾 Powered by AgriVibe KE Farm Solutions</p>
          <p className="text-gray-500 text-sm mt-1">Innovating Agriculture. Empowering Communities. Delivering Trust.</p>
        </div>
      </div>

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

// Add missing import
import { Store } from 'lucide-react';