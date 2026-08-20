// src/pages/privacy.tsx
import { useState, useEffect } from 'react';
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
  Eye,
  Database,
  Server,
  UserCheck,
  Cookie,
  FileText,
  Globe,
  Users,
  Heart,
  Award
} from 'lucide-react';

export default function Privacy() {
  const [activeSection, setActiveSection] = useState('introduction');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  const sections = [
    { id: 'introduction', label: 'Introduction', icon: FileText },
    { id: 'collect', label: 'Information We Collect', icon: Database },
    { id: 'use', label: 'How We Use Your Data', icon: Server },
    { id: 'share', label: 'Sharing Information', icon: Users },
    { id: 'security', label: 'Data Security', icon: Shield },
    { id: 'cookies', label: 'Cookies', icon: Cookie },
    { id: 'rights', label: 'Your Rights', icon: UserCheck },
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
              <Shield className="w-5 h-5 text-agrivibe-gold" />
              Your Privacy Matters
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
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

              {/* Contact Quick Card */}
              <div className="mt-6 p-4 bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 rounded-xl border border-agrivibe-green/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-agrivibe-green rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Need help?</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Contact our privacy team</p>
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
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  AgriVibe Marketplace ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services.
                </p>
                <div className="mt-4 p-4 bg-agrivibe-green/5 rounded-xl border border-agrivibe-green/10">
                  <p className="text-gray-600 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-agrivibe-green flex-shrink-0 mt-0.5" />
                    By using AgriVibe Marketplace, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="collect" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-agrivibe-green" />
                      Personal Information
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Name, email address, phone number, delivery address, and payment information when you register, place orders, or contact us.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-agrivibe-green" />
                      Usage Data
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Information about how you interact with our platform, including pages visited, products viewed, order history, and browsing patterns.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Server className="w-4 h-4 text-agrivibe-green" />
                      Device Information
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">IP address, browser type, device type, operating system, and location data (if enabled) to improve our services and security.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="use" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Process and fulfill your orders',
                    'Provide delivery and payment services',
                    'Communicate with you about orders and updates',
                    'Improve our platform and user experience',
                    'Prevent fraud and ensure security',
                    'Personalize your shopping experience',
                    'Send promotional offers (with your consent)',
                    'Comply with legal and regulatory requirements',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <CheckCircle className="w-5 h-5 text-agrivibe-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sharing Information */}
            <section id="share" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Sharing Your Information</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:
                </p>
                <ul className="space-y-2">
                  {[
                    'Vendors to fulfill your orders and deliver products',
                    'Drivers for delivery services',
                    'Payment processors to process transactions',
                    'Service providers who assist in platform operations',
                    'Legal authorities when required by law',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Shield className="w-4 h-4 text-agrivibe-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section id="security" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Secure servers and encrypted connections',
                    'Access controls and authentication mechanisms',
                    'Regular security assessments and monitoring',
                    'Data encryption for sensitive information',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                      <Lock className="w-4 h-4 text-agrivibe-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, remember your preferences, and analyze how you interact with our platform. You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
                <ul className="space-y-2">
                  {[
                    'Access the personal information we hold about you',
                    'Request correction of inaccurate information',
                    'Request deletion of your data (subject to legal requirements)',
                    'Opt-out of marketing communications',
                    'Withdraw consent for data processing where applicable',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <CheckCircle className="w-4 h-4 text-agrivibe-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-agrivibe-green rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href="mailto:privacy@agrivibe.com" className="text-agrivibe-green font-semibold hover:underline text-sm">
                        privacy@agrivibe.com
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

// Add missing imports
import { useRef } from 'react';
import { Clock } from 'lucide-react';