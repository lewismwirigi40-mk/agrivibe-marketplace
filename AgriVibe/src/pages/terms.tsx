// src/pages/terms.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileText,
  Users,
  ShoppingCart,
  Truck,
  RefreshCw,
  Store,
  Scale,
  Gavel,
  Clock,
  UserCheck,
  FileCheck,
  Award
} from 'lucide-react';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  const sections = [
    { id: 'acceptance', label: 'Acceptance of Terms', icon: FileCheck },
    { id: 'accounts', label: 'User Accounts', icon: Users },
    { id: 'orders', label: 'Orders & Payments', icon: ShoppingCart },
    { id: 'delivery', label: 'Delivery & Returns', icon: Truck },
    { id: 'vendor', label: 'Vendor Terms', icon: Store },
    { id: 'conduct', label: 'User Conduct', icon: Shield },
    { id: 'liability', label: 'Limitation of Liability', icon: Scale },
    { id: 'governing', label: 'Governing Law', icon: Gavel },
    { id: 'changes', label: 'Changes to Terms', icon: Clock },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <FileText className="w-5 h-5 text-agrivibe-gold" />
              Legal Agreement
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Please read these terms carefully before using AgriVibe Marketplace.
            </p>
            <p className="text-white/50 text-sm mt-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated: August 2026
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
            <span>Scroll to read</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ====== CONTENT SECTION ====== */}
      <div className="container-premium py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== SIDEBAR NAVIGATION ====== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 px-3">
                On this page
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-agrivibe-green/10 text-agrivibe-green'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-agrivibe-green'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${
                        activeSection === section.id ? 'text-agrivibe-green' : 'text-gray-400'
                      }`} />
                      <span className="text-left">{section.label}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto text-agrivibe-green" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Contact Card */}
              <div className="mt-6 p-4 bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 rounded-xl border border-agrivibe-green/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-agrivibe-green rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Questions?</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Contact our legal team</p>
                <a 
                  href="tel:+254769074319" 
                  className="text-agrivibe-green font-bold text-sm hover:underline flex items-center gap-1"
                >
                  +254 769 074 319
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* ====== MAIN CONTENT ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            {/* Acceptance of Terms */}
            <section id="acceptance" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  By using AgriVibe Marketplace ("we", "our", "us"), you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our platform or services.
                </p>
                <div className="mt-4 p-4 bg-agrivibe-green/5 rounded-xl border border-agrivibe-green/10">
                  <p className="text-gray-600 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-agrivibe-green flex-shrink-0 mt-0.5" />
                    By continuing to use our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section id="accounts" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-agrivibe-green" />
                      Registration
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">You must register an account to use certain features of our platform. You agree to provide accurate, current, and complete information during registration and to update it as necessary.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-agrivibe-green" />
                      Account Security
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Account Termination
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activities, or misuse our platform.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Orders & Payments */}
            <section id="orders" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Orders & Payments</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-agrivibe-green" />
                      Order Placement
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">When you place an order, you agree to pay the listed price plus any applicable delivery fees and taxes. Orders are subject to availability and vendor confirmation.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-agrivibe-green" />
                      Payment Processing
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Payments are processed through secure payment gateways. We accept M-Pesa, Credit/Debit Cards, and Wallet Balance. All transactions are encrypted and secure.</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 rounded-xl border border-agrivibe-green/20">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-agrivibe-green" />
                      Escrow Protection
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Payments are held in escrow until delivery is confirmed. This ensures both buyers and sellers are protected throughout the transaction process.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery & Returns */}
            <section id="delivery" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery & Returns</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-agrivibe-green" />
                      Delivery Policy
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">We strive to deliver orders within the estimated timeframe. Delivery times are estimates and may vary based on location, vendor availability, and other factors.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-agrivibe-green" />
                      Delivery Code
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Upon delivery, you will receive a 6-digit delivery code. Provide this code to the driver only upon receiving your items. Do not share this code with anyone else.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-agrivibe-green" />
                      Returns & Refunds
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Returns and refunds are handled on a case-by-case basis. Please contact our support team within 7 days of delivery to initiate a return or refund request.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Vendor Terms */}
            <section id="vendor" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Vendor Terms</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-agrivibe-green" />
                      Vendor Registration
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Vendors must complete the registration process and be approved by our admin team before listing products on our platform.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-agrivibe-green" />
                      Product Listings
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Vendors are responsible for accurate product descriptions, pricing, and availability. Products must meet quality standards and comply with all applicable regulations.</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-agrivibe-gold/10 to-orange-500/10 rounded-xl border border-agrivibe-gold/20">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-agrivibe-gold" />
                      Commission
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">A commission fee applies to each sale made through our platform. The current commission rate is 10% of the product price. This supports platform operations and payment processing.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section id="conduct" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">User Conduct</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Provide accurate and truthful information',
                    'Do not engage in fraudulent activities',
                    'Respect other users and vendors',
                    'Do not misuse the platform or services',
                    'Comply with all applicable laws and regulations',
                    'Do not attempt to bypass security measures',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-agrivibe-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  AgriVibe Marketplace is provided "as is" and "as available". We do not warrant that our platform will be uninterrupted, error-free, or free of viruses or other harmful components. We are not liable for any damages arising from the use of our platform or services.
                </p>
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-amber-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    We are not responsible for the quality, safety, or legality of products sold by vendors. All transactions are between buyers and vendors, with our platform facilitating the connection and payment process.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section id="changes" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Changes to Terms</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Continued use of our platform after any changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-agrivibe-green rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href="mailto:legal@agrivibe.com" className="text-agrivibe-green font-semibold hover:underline text-sm">
                        legal@agrivibe.com
                      </a>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-agrivibe-green rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href="tel:+254769074319" className="text-agrivibe-green font-semibold hover:underline text-sm">
                        +254 769 074 319
                      </a>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3 sm:col-span-2">
                    <div className="w-10 h-10 bg-agrivibe-green rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-gray-700 text-sm">AgriVibe KE Farm Solutions, Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center text-gray-500 text-sm pt-6 border-t border-gray-200">
              <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
            </div>
          </motion.div>
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