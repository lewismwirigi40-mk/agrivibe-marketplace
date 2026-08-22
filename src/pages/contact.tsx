// src/pages/contact.tsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  User,
  MessageCircle,
  Building,
  Globe,
  Shield,
  Award,
  Headphones,
  Clock as ClockIcon,
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+254 769 074 319',
      href: 'tel:+254769074319',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@agrivibe.com',
      href: 'mailto:support@agrivibe.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'AgriVibe KE Farm Solutions, Nairobi, Kenya',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: ClockIcon,
      label: 'Business Hours',
      value: 'Mon–Fri: 8AM–5PM | Sat: 9AM–1PM',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const quickLinks = [
    { label: 'FAQ', href: '/faq', icon: MessageCircle },
    { label: 'About Us', href: '/about', icon: Building },
    { label: 'Privacy Policy', href: '/privacy', icon: Shield },
    { label: 'Terms & Conditions', href: '/terms', icon: Award },
  ];

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'general', label: 'General Enquiry' },
    { value: 'order', label: 'Order Assistance' },
    { value: 'delivery', label: 'Delivery Enquiry' },
    { value: 'vendor', label: 'Become a Vendor' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'feedback', label: 'Feedback / Suggestion' },
    { value: 'other', label: 'Other' },
  ];

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
              <Headphones className="w-5 h-5 text-agrivibe-gold" />
              We're Here to Help
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Have a question, need assistance, or want to become a vendor? We'd love to hear from you.
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
            <span>Get in touch</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ====== CONTENT SECTION ====== */}
      <div className="container-premium -mt-8 relative z-20 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== CONTACT FORM ====== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                  <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                </div>
              </div>
              
              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-500/10 text-green-600 p-4 rounded-xl border border-green-500/20 mb-6 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Message sent successfully!</span>
                      <p className="text-sm text-green-600/70">We'll get back to you soon.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 text-red-600 p-4 rounded-xl border border-red-500/20 mb-6 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        focusedField === 'name' ? 'text-agrivibe-green' : 'text-gray-400'
                      }`} />
                      <input
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                          focusedField === 'name' 
                            ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        focusedField === 'email' ? 'text-agrivibe-green' : 'text-gray-400'
                      }`} />
                      <input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Phone Number
  </label>
  <div className="relative group">
    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
      focusedField === 'phone' ? 'text-agrivibe-green' : 'text-gray-400'
    }`} />
    <input
      name="phone"
      placeholder="254700000000"
      value={formData.phone}
      onChange={handleChange}
      onFocus={() => setFocusedField('phone')}
      onBlur={() => setFocusedField(null)}
      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
        focusedField === 'phone' 
          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    />
  </div>
</div>
                

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 outline-none transition-all duration-300 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 appearance-none cursor-pointer"
                      required
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 resize-none ${
                        focusedField === 'message' 
                          ? 'border-agrivibe-green shadow-lg shadow-agrivibe-green/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green via-agrivibe-green-light to-agrivibe-green bg-[length:200%_100%] animate-gradient rounded-xl" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <div className="relative flex items-center justify-center gap-2 w-full px-6 py-4 text-white font-bold text-lg">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* ====== CONTACT INFO SIDEBAR ====== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-96 space-y-6"
          >
            {/* Contact Info Cards */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-agrivibe-gold" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      key={index}
                      href={info.href || '#'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{info.label}</p>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-agrivibe-green transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-agrivibe-green" />
                Quick Links
              </h3>
              
              <ul className="space-y-2">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:text-agrivibe-green hover:bg-gray-50 transition-all group"
                      >
                        <Icon className="w-4 h-4 text-gray-400 group-hover:text-agrivibe-green transition-colors" />
                        <span className="text-sm font-medium">{link.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-agrivibe-green group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Social Links */}
<div className="bg-gradient-to-br from-agrivibe-green/5 to-emerald-500/5 rounded-2xl border border-agrivibe-green/20 p-6 text-center">
  <h3 className="text-sm font-semibold text-gray-600 mb-4">Connect With Us</h3>
  <div className="flex justify-center gap-3">
    <a
      href="#"
      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-agrivibe-green hover:text-white transition-all duration-300"
    >
      Facebook
    </a>
    <a
      href="#"
      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-agrivibe-green hover:text-white transition-all duration-300"
    >
      Twitter
    </a>
    <a
      href="#"
      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-agrivibe-green hover:text-white transition-all duration-300"
    >
      Instagram
    </a>
    <a
      href="#"
      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-agrivibe-green hover:text-white transition-all duration-300"
    >
      YouTube
    </a>
  </div>
</div>
            {/* Live Chat CTA */}
            <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-2xl p-6 text-white text-center">
              <Headphones className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h4 className="font-bold text-lg">Need immediate help?</h4>
              <p className="text-white/80 text-sm mb-4">Chat with our support team</p>
              <a
                href="tel:+254769074319"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call +254 769 074 319
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}