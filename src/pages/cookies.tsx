// src/pages/cookies.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  Shield,
  CheckCircle,
  XCircle,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUp,
  Settings,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

export default function Cookies() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preference: false,
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const [saved, setSaved] = useState(false);

  const cookieTypes = [
    {
      id: "essential",
      name: "Essential Cookies",
      description:
        "Required for the platform to function properly. Cannot be disabled.",
      required: true,
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "Help us understand how you interact with our platform.",
      required: false,
      icon: Sparkles,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "Used to deliver personalized ads and promotions.",
      required: false,
      icon: CheckCircle,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "preference",
      name: "Preference Cookies",
      description: "Remember your settings and preferences.",
      required: false,
      icon: Settings,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleToggle = (id: string) => {
    if (id === "essential") return;
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* ====== HEADER ====== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center mix-blend-overlay opacity-10" />

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20 mb-6">
                <Cookie className="w-4 h-4" />
                Cookie Policy
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                How We Use{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                  Cookies
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                We use cookies to enhance your experience on AgriVibe
              </p>
              <p className="text-white/50 text-sm mt-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Last updated: {currentYear}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====== COOKIE POLICY ====== */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <div className="prose max-w-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">
                  Cookie Policy
                </h2>
                <p className="text-gray-500 text-sm m-0">
                  Last updated: {currentYear}
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              AgriVibe uses cookies to improve your browsing experience, analyze
              site traffic, and deliver personalized content. This policy
              explains how we use cookies and how you can manage your
              preferences.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mt-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 text-sm">
                  What are cookies?
                </p>
                <p className="text-sm text-blue-600">
                  Cookies are small text files stored on your device when you
                  visit our platform. They help us remember your preferences and
                  improve your experience.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 flex items-center gap-2">
              <Settings className="w-5 h-5 text-agrivibe-green" />
              Types of cookies we use
            </h2>

            <div className="space-y-4 mt-4">
              {cookieTypes.map((cookie, index) => {
                const Icon = cookie.icon;
                const isEnabled =
                  preferences[cookie.id as keyof typeof preferences];
                const isRequired = cookie.required;

                return (
                  <motion.div
                    key={cookie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-gray-50 rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${
                      isEnabled ? "border border-agrivibe-green/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${cookie.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {cookie.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cookie.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isRequired ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          Required
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggle(cookie.id)}
                          className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                            isEnabled ? "bg-agrivibe-green" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                              isEnabled ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Save Preferences */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-sm text-gray-500 hover:text-agrivibe-green transition-colors flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Manage preferences
              </button>
              <button
                onClick={handleSavePreferences}
                className="ml-auto px-6 py-2.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105"
              >
                Save Preferences
              </button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-sm flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Saved!
                </motion.span>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8">
              Managing your cookie preferences
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You can manage your cookie preferences through your browser
              settings. Please note that disabling essential cookies may affect
              the functionality of our platform.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mt-6 flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700">
                  Your privacy matters
                </p>
                <p className="text-sm text-green-600">
                  We are committed to protecting your data and ensuring
                  transparency in how we collect and use cookies.
                </p>
              </div>
            </div>

            {/* Cookie Declaration */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-agrivibe-green" />
                Cookie Declaration
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {currentYear}. AgriVibe uses {cookieTypes.length}{" "}
                types of cookies to enhance your experience.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                {cookieTypes.map((cookie) => (
                  <span
                    key={cookie.id}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-600"
                  >
                    {cookie.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== CONTACT SECTION ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-200/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Questions about cookies?
                </h3>
                <p className="text-sm text-gray-500">
                  Contact our privacy team
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:privacy@agrivibe.com"
                className="px-4 py-2 bg-white text-agrivibe-green rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border border-agrivibe-green/20"
              >
                Email Us
              </a>
              <a
                href="tel:+254769074319"
                className="px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300"
              >
                Call Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌾</span>
                </div>
                <span className="text-xl font-bold text-white">AgriVibe</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting farmers, vendors, and students across Kenyan
                campuses.
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-agrivibe-green" />
                  <a
                    href="tel:+254769074319"
                    className="hover:text-white transition-colors"
                  >
                    +254 769 074 319
                  </a>
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-agrivibe-green" />
                  <span>657-10100, Nyeri, Kenya</span>
                </p>
              </div>
              <div className="flex gap-4 mt-4"></div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Marketplace
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendors"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Vendors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Deals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © {currentYear} AgriVibe KE Farm Solutions. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              657-10100, Nyeri, Kenya | +254 769 074 319
            </p>
          </div>
        </div>
      </footer>

      {/* ====== BACK TO TOP ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
