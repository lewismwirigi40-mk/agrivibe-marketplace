// src/components/FloatingButtons.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  ChevronUp, 
  Phone, 
  Mail, 
  HelpCircle,
  X,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const whatsappNumber = '254769074319';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ====== WHATSAPP CHAT BUTTON ====== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
        onMouseEnter={() => setIsWhatsAppHovered(true)}
        onMouseLeave={() => setIsWhatsAppHovered(false)}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-60 animate-pulse" />
        
        {/* Main Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
          </div>
          <span className="font-semibold text-sm hidden sm:inline">Chat with us</span>
          <span className="font-semibold text-sm sm:hidden">WhatsApp</span>
          
          {/* Tooltip */}
          <AnimatePresence>
            {isWhatsAppHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border border-white/10 shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-green-400" />
                  Online • Response in 2 min
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      </motion.div>

      {/* ====== EXPANDABLE HELP BUTTON ====== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-2 min-w-[180px]"
            >
              <div className="space-y-1">
                <a
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Mail className="w-4 h-4 text-agrivibe-green" />
                  <span className="text-sm font-medium">Email Support</span>
                </a>
                <a
                  href="tel:+254769074319"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Call Us</span>
                </a>
                <a
                  href="/faq"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <HelpCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">FAQ</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex items-center gap-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-gray-900/30 hover:shadow-gray-900/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
        >
          {isExpanded ? (
            <>
              <X className="w-6 h-6" />
              <span className="font-semibold text-sm hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <HelpCircle className="w-6 h-6" />
              <span className="font-semibold text-sm hidden sm:inline">Need Help?</span>
              <span className="font-semibold text-sm sm:hidden">Help</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
            </>
          )}
        </button>
      </motion.div>

      {/* ====== SCROLL TO TOP BUTTON ====== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="relative flex items-center gap-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-agrivibe-green/40 hover:shadow-agrivibe-green/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
          >
            <div className="relative">
              <ChevronUp className="w-6 h-6" />
              <Sparkles className="absolute -top-2 -right-2 w-3 h-3 text-yellow-300" />
            </div>
            <span className="font-semibold text-sm hidden sm:inline">Back to Top</span>
            <span className="font-semibold text-sm sm:hidden">Top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== STATUS INDICATOR ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 text-white text-xs"
      >
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        <span>Support Online</span>
        <span className="text-white/40">|</span>
        <span className="text-white/60">24/7</span>
      </motion.div>
    </div>
  );
}