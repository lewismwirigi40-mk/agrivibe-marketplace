// src/pages/vendors.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Star,
  MapPin,
  Package,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Users,
  Clock,
  Heart,
  Shield,
  Truck,
  Leaf,
  CheckCircle,
  Quote,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

export default function Vendors() {
  const [likedVendors, setLikedVendors] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  const handleLike = (id: number) => {
    setLikedVendors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (likedVendors[id] ? -1 : 1),
    }));
  };

  const vendors = [
    {
      id: 1,
      name: "Green Farm Produce",
      location: "Nyeri",
      rating: 4.8,
      products: 156,
      sales: 2340,
      joined: "2024",
      verified: true,
      categories: ["Vegetables", "Fruits"],
      description:
        "Premium organic vegetables and fruits from the slopes of Mount Kenya.",
      image: "🌿",
    },
    {
      id: 2,
      name: "Avocado Paradise",
      location: "Kiambu",
      rating: 4.9,
      products: 89,
      sales: 1870,
      joined: "2024",
      verified: true,
      categories: ["Fruits", "Organic"],
      description:
        "Kenya's finest avocados - creamy, rich, and sustainably grown.",
      image: "🥑",
    },
    {
      id: 3,
      name: "Healthy Greens",
      location: "Nairobi",
      rating: 4.7,
      products: 234,
      sales: 3200,
      joined: "2023",
      verified: true,
      categories: ["Vegetables", "Herbs"],
      description: "Fresh greens and herbs delivered daily to your campus.",
      image: "🥬",
    },
    {
      id: 4,
      name: "Tropical Fruits Ltd",
      location: "Thika",
      rating: 4.6,
      products: 120,
      sales: 1560,
      joined: "2024",
      verified: true,
      categories: ["Fruits", "Exotic"],
      description:
        "Exotic tropical fruits from the heart of Kenya's fruit basket.",
      image: "🍍",
    },
    {
      id: 5,
      name: "Dairy Delight",
      location: "Nakuru",
      rating: 4.8,
      products: 67,
      sales: 980,
      joined: "2024",
      verified: true,
      categories: ["Dairy", "Organic"],
      description: "Fresh milk, yogurt, and cheese from grass-fed cows.",
      image: "🥛",
    },
    {
      id: 6,
      name: "Spice & Herb Co.",
      location: "Meru",
      rating: 4.9,
      products: 45,
      sales: 760,
      joined: "2025",
      verified: true,
      categories: ["Herbs", "Spices"],
      description: "Premium spices and herbs for every kitchen.",
      image: "🌶️",
    },
    {
      id: 7,
      name: "Fresh Catch Seafood",
      location: "Kisumu",
      rating: 4.7,
      products: 56,
      sales: 890,
      joined: "2024",
      verified: true,
      categories: ["Seafood", "Fresh"],
      description: "Sustainably sourced fresh fish from Lake Victoria.",
      image: "🐟",
    },
    {
      id: 8,
      name: "Organic Grains Mill",
      location: "Eldoret",
      rating: 4.8,
      products: 78,
      sales: 1200,
      joined: "2024",
      verified: true,
      categories: ["Grains", "Organic"],
      description:
        "Stone-ground organic flours and grains from the Rift Valley.",
      image: "🌾",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "James Mwangi",
      role: "Customer, JKUAT",
      quote:
        "The quality from Green Farm Produce is unmatched. I've been ordering from them for 6 months and I've never been disappointed.",
      avatar: "👨‍🌾",
      vendor: "Green Farm Produce",
    },
    {
      id: 2,
      name: "Dr. Sarah Kariuki",
      role: "Customer, UON",
      quote:
        "Avocado Paradise delivers the best avocados in Kenya. Creamy, fresh, and always on time.",
      avatar: "👩‍⚕️",
      vendor: "Avocado Paradise",
    },
    {
      id: 3,
      name: "Peter Otieno",
      role: "Customer, DeKUT",
      quote:
        "Healthy Greens has transformed how I eat. Fresh vegetables delivered to my campus every week.",
      avatar: "👨‍🎓",
      vendor: "Healthy Greens",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Vendors",
      desc: "All vendors are verified and trusted sellers",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Fresh produce delivered to your campus",
    },
    {
      icon: Leaf,
      title: "Quality Guarantee",
      desc: "Premium quality products every time",
    },
    {
      icon: Star,
      title: "Top Ratings",
      desc: "Vendors with the best customer ratings",
    },
  ];

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
                <Store className="w-4 h-4" />
                Verified Vendors
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                  Trusted Vendors
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Connect with verified farmers and sellers across Kenya
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====== STATS SECTION ====== */}
      <div className="py-12 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Store, label: "Vendors", value: vendors.length },
              { icon: Package, label: "Products", value: "1,500+" },
              { icon: Users, label: "Happy Customers", value: "15,000+" },
              { icon: Star, label: "Avg. Rating", value: "4.8 ⭐" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green/10 to-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-agrivibe-green" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== WHY CHOOSE ====== */}
      <div className="py-12 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Why Choose Our Vendors
            </span>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green/10 to-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-agrivibe-green" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{benefit.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== VENDORS LIST ====== */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Vendors
            </h2>
            <p className="text-gray-500 mt-1">
              {vendors.length} trusted sellers across Kenya
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 text-agrivibe-green rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Verified
          </span>
        </div>

        <div className="space-y-6">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Vendor Info */}
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-16 h-16 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-agrivibe-green/20 flex-shrink-0"
                  >
                    {vendor.image}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-agrivibe-green transition-colors">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                          <Award className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1 max-w-md">
                      {vendor.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {vendor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {vendor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {vendor.products} products
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Joined {vendor.joined}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {vendor.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(vendor.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                      likedVendors[vendor.id]
                        ? "bg-red-50 text-red-500 border border-red-200"
                        : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 border border-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        likedVendors[vendor.id]
                          ? "fill-red-500 text-red-500 scale-110"
                          : ""
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {likeCounts[vendor.id] || 0}
                    </span>
                  </motion.button>

                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="font-bold text-gray-900">
                      {vendor.sales.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/marketplace?vendor=${vendor.id}`}
                    className="inline-flex items-center gap-1 px-5 py-2.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105"
                  >
                    View Products
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ====== TESTIMONIALS ====== */}
      <div className="py-16 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Quote className="w-4 h-4" />
              What Our Community Says
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Vendor <span className="text-gradient-green">Testimonials</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-agrivibe-green to-emerald-500 flex items-center justify-center text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-agrivibe-green font-medium">
                      {testimonial.vendor}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== CTA SECTION ====== */}
      <div className="py-16 bg-gradient-to-r from-agrivibe-green to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-4">
              <Store className="w-4 h-4" />
              Join Our Network
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Become a <span className="text-yellow-300">Verified Vendor</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-3">
              Join Kenya's fastest-growing agricultural marketplace. Reach
              thousands of customers across campuses nationwide.
            </p>
            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 mt-6 bg-white text-agrivibe-green px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Register Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
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
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2026 AgriVibe KE Farm Solutions. All rights reserved.
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
        <ArrowLeft className="w-5 h-5 rotate-90" />
      </button>
    </div>
  );
}
