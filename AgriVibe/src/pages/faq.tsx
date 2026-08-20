// src/pages/faq.tsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight,
  Search,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  Shield,
  Store,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users,
  Award
} from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  const faqs = [
    {
      category: 'Getting Started',
      icon: HelpCircle,
      question: 'What is AgriVibe Marketplace?',
      answer: 'AgriVibe Marketplace is a digital platform that connects customers with verified farmers, wholesalers, and local vendors to buy fresh agricultural products online. We provide a secure, convenient, and reliable marketplace for fresh farm produce and related products.'
    },
    {
      category: 'Orders',
      icon: ShoppingBag,
      question: 'How do I place an order?',
      answer: 'Simply browse our marketplace, add products to your cart, proceed to checkout, provide your delivery details, select your payment method, and confirm your order. You will receive a confirmation and delivery tracking information after placing your order.'
    },
    {
      category: 'Payments',
      icon: CreditCard,
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, Credit/Debit Cards, and Wallet Balance. All payments are processed securely through our integrated payment systems with bank-grade encryption.'
    },
    {
      category: 'Delivery',
      icon: Truck,
      question: 'How does delivery work?',
      answer: 'After you place your order, the vendor prepares your items. A driver picks up your order and delivers it to your specified address. You will receive a delivery code that you must provide to the driver upon receiving your items to confirm delivery.'
    },
    {
      category: 'Vendors',
      icon: Store,
      question: 'How do I become a vendor?',
      answer: 'You can become a vendor by completing the vendor registration form on our website. After registration, your application will be reviewed and approved by our admin team. Once approved, you can start listing products and selling on our marketplace.'
    },
    {
      category: 'Delivery',
      icon: Truck,
      question: 'What is the delivery fee?',
      answer: 'Delivery fees vary depending on your location and order size. Orders above KES 1,000 qualify for free delivery. Standard delivery fees range from KES 50 to KES 200 depending on distance and order size.'
    },
    {
      category: 'Orders',
      icon: ShoppingBag,
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 30 minutes of placing it. After that, orders cannot be cancelled as they are being processed for delivery. Contact our support team for assistance with order cancellation.'
    },
    {
      category: 'Delivery',
      icon: Shield,
      question: 'What is the delivery code?',
      answer: 'After placing an order, you receive a 6-digit delivery code via SMS and email. This code is confidential and should only be shared with your driver upon receiving your items. It helps verify successful delivery and releases payment to the vendor.'
    },
    {
      category: 'Payments',
      icon: Shield,
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed through secure payment gateways. We use escrow protection to hold payments until delivery is confirmed, ensuring both buyer and seller are protected throughout the transaction process.'
    },
    {
      category: 'Orders',
      icon: Clock,
      question: 'How do I track my order?',
      answer: 'You can track your order through your account dashboard. Once your order is assigned to a driver, you will receive real-time updates on the delivery status. You can also contact our support team for assistance with order tracking.'
    },
    {
      category: 'Returns',
      icon: RefreshCw,
      question: 'What if I receive damaged or incorrect items?',
      answer: 'If you receive damaged or incorrect items, please contact our customer support team immediately within 24 hours of delivery. We will work with the vendor to resolve the issue, which may include a refund, replacement, or other appropriate solutions.'
    },
    {
      category: 'Returns',
      icon: RefreshCw,
      question: 'What is AgriVibe\'s refund policy?',
      answer: 'We strive to ensure customer satisfaction. If you are not satisfied with your purchase, you may request a refund within 7 days of delivery. Refunds are processed based on the nature of the issue and vendor policies. Contact our support team for assistance.'
    },
  ];

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter FAQs based on search and category
  useEffect(() => {
    let result = faqs;
    
    if (searchQuery.trim()) {
      result = result.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(faq => faq.category === selectedCategory);
    }
    
    setFilteredFaqs(result);
  }, [searchQuery, selectedCategory]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Getting Started': HelpCircle,
      'Orders': ShoppingBag,
      'Payments': CreditCard,
      'Delivery': Truck,
      'Vendors': Store,
      'Returns': RefreshCw,
    };
    return icons[category] || HelpCircle;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-premium-light overflow-x-hidden">
      {/* ====== HERO SECTION ====== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[50vh] flex items-center overflow-hidden"
      >
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

        <div className="container-premium relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 shadow-2xl mb-6">
              <HelpCircle className="w-5 h-5 text-agrivibe-gold" />
              Got Questions?
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Frequently Asked
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                Questions
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Find answers to common questions about AgriVibe Marketplace, orders, deliveries, payments, and more.
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
            <span>Browse FAQs</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ====== SEARCH & FILTER ====== */}
      <div className="container-premium -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === 'All'
                    ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ====== FAQ LIST ====== */}
      <div className="container-premium py-12">
        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-gray-500"
        >
          Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
        </motion.div>

        {filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No results found</h3>
            <p className="text-gray-500 text-lg">
              {searchQuery ? `No FAQs match "${searchQuery}"` : 'No FAQs in this category'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 btn-premium"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFaqs.map((faq, index) => {
              const Icon = faq.icon;
              const CategoryIcon = getCategoryIcon(faq.category);
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="lg:col-span-1"
                >
                  <div
                    className={`bg-white rounded-2xl shadow-md border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-agrivibe-green shadow-xl shadow-agrivibe-green/10' 
                        : 'border-gray-100 hover:shadow-lg hover:border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex items-start gap-3 p-5 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        isOpen 
                          ? 'bg-agrivibe-green text-white' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-agrivibe-green bg-agrivibe-green/10 px-2 py-0.5 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOpen 
                            ? 'bg-agrivibe-green/10 text-agrivibe-green' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <div className="h-px bg-gray-100 mb-4" />
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                              <CheckCircle className="w-4 h-4 text-agrivibe-green" />
                              <span>Verified information</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ====== CONTACT SECTION ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 rounded-2xl border border-agrivibe-green/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any questions you may have.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 btn-premium"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="tel:+254769074319" 
                className="inline-flex items-center gap-2 btn-premium-secondary"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
            <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-agrivibe-green" />
                <span>+254 769 074 319</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-agrivibe-green" />
                <span>support@agrivibe.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-agrivibe-green" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </motion.div>
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