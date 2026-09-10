// src/pages/careers.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  Award,
  TrendingUp,
  Zap,
  Shield,
  Heart,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  Globe,
  ArrowUp,
  CheckCircle,
  Star,
  Quote,
  Coffee,
  Gift,
  Smartphone,
  BookOpen,
  BarChart,
  Leaf,
  Sun,
  Battery,
  Cloud,
  Laptop,
  Plane,
  GraduationCap,
  UserCheck,
  FileText,
  Send,
  ArrowRight,
  Building2,
  Briefcase as BriefcaseIcon,
} from "lucide-react";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const positions = [
    {
      id: 1,
      title: "Agricultural Data Scientist",
      department: "Data Science",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 180k - 280k",
      posted: "2 days ago",
      description:
        "Analyze agricultural data, build predictive models for crop yields, and optimize supply chain operations using machine learning.",
      icon: BarChart,
    },
    {
      id: 2,
      title: "Market Research Analyst",
      department: "Strategy",
      location: "Remote (Kenya)",
      type: "Full-time",
      salary: "KES 120k - 180k",
      posted: "3 days ago",
      description:
        "Track market trends, analyze customer behavior, and provide actionable insights to drive business growth.",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Agricultural Economist",
      department: "Agriculture",
      location: "Nyeri, Kenya",
      type: "Full-time",
      salary: "KES 150k - 220k",
      posted: "4 days ago",
      description:
        "Evaluate farming systems, assess policy impacts, and develop sustainable economic models for smallholder farmers.",
      icon: Leaf,
    },
    {
      id: 4,
      title: "Farm Operations Manager",
      department: "Agriculture",
      location: "Kiambu, Kenya",
      type: "Full-time",
      salary: "KES 100k - 160k",
      posted: "5 days ago",
      description:
        "Oversee farm operations, manage supply chain logistics, and ensure quality standards across the produce network.",
      icon: Sun,
    },
    {
      id: 5,
      title: "Data Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "KES 200k - 300k",
      posted: "6 days ago",
      description:
        "Build and maintain data pipelines, optimize databases, and enable real-time analytics for the platform.",
      icon: Cloud,
    },
    {
      id: 6,
      title: "Agri-Marketplace Specialist",
      department: "Strategy",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 130k - 190k",
      posted: "1 week ago",
      description:
        "Develop vendor relationships, optimize product listings, and grow the marketplace ecosystem across campuses.",
      icon: Building2,
    },
    {
      id: 7,
      title: "Supply Chain Analyst",
      department: "Operations",
      location: "Nakuru, Kenya",
      type: "Full-time",
      salary: "KES 110k - 170k",
      posted: "1 week ago",
      description:
        "Optimize supply chain operations, reduce waste, and improve delivery efficiency across the network.",
      icon: Clock,
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health Insurance",
      desc: "Comprehensive medical coverage for you and your family",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: GraduationCap,
      title: "Learning Budget",
      desc: "KES 50,000/year for courses and certifications",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Laptop,
      title: "Work Equipment",
      desc: "MacBook Pro + all necessary tools",
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: Gift,
      title: "Performance Bonus",
      desc: "Up to 30% annual performance bonus",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      desc: "Work when you're most productive",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Plane,
      title: "Annual Retreat",
      desc: "Team retreats to build culture and connection",
      color: "from-teal-500 to-emerald-500",
    },
  ];

  const process = [
    { step: "Apply", icon: FileText, color: "from-blue-500 to-blue-600" },
    { step: "Interview", icon: Users, color: "from-purple-500 to-purple-600" },
    {
      step: "Assessment",
      icon: BarChart,
      color: "from-orange-500 to-orange-600",
    },
    {
      step: "Offer",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const testimonials = [
    {
      name: "Grace Wanjiru",
      role: "Agricultural Data Scientist",
      quote:
        "Working at AgriVibe has been transformative. I get to use data science to solve real problems that impact farmers' lives.",
      avatar: "👩‍🔬",
    },
    {
      name: "James Mwangi",
      role: "Market Research Analyst",
      quote:
        "The culture at AgriVibe is incredible. Everyone is passionate about making agriculture better for Kenya.",
      avatar: "👨‍💼",
    },
    {
      name: "Dr. Sarah Kariuki",
      role: "Agricultural Economist",
      quote:
        "I've worked in agri-tech before, but AgriVibe truly understands the intersection of technology and agriculture.",
      avatar: "👩‍🏫",
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
                <Briefcase className="w-4 h-4" />
                Join Our Team
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Build the Future of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                  African Agriculture
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Join AgriVibe and help us revolutionize the way fresh produce
                moves from farm to table across Kenya and beyond.
              </p>
              <p className="text-white/60 text-sm mt-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {positions.length} open positions
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====== STATS ====== */}
      <div className="py-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Team Members", value: "45+" },
              { icon: TrendingUp, label: "Growth Rate", value: "200%" },
              { icon: Award, label: "Avg. Rating", value: "4.9 ⭐" },
              { icon: Globe, label: "Locations", value: "6 Counties" },
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
                  <div className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== VALUES ====== */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Our Values
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3">
            What Drives Us{" "}
            <span className="text-gradient-green">Every Day</span>
          </h2>
          <p className="text-gray-500 mt-2">
            The principles that guide our work and culture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Trust & Transparency",
              desc: "We believe in honesty and open communication.",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Users,
              title: "Community First",
              desc: "We prioritize the needs of our farmers and customers.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Zap,
              title: "Innovation",
              desc: "We embrace technology to solve real-world problems.",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: Heart,
              title: "Impact",
              desc: "Building a sustainable future for African agriculture.",
              color: "from-red-500 to-pink-500",
            },
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ====== BENEFITS ====== */}
      <div className="py-16 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Gift className="w-4 h-4" />
              Why Join Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Employee <span className="text-gradient-green">Benefits</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon className="w-5 h-5 text-white" />
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

      {/* ====== OPEN POSITIONS ====== */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Open Positions
              </h2>
              <p className="text-gray-500 mt-1">
                Join our growing team of innovators
              </p>
            </div>
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-green-50 text-agrivibe-green rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {positions.length} Positions
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {positions.map((position, index) => {
                const Icon = position.icon;
                return (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 border border-gray-100 cursor-pointer"
                    onClick={() =>
                      setSelectedJob(
                        selectedJob === position.id ? null : position.id,
                      )
                    }
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-agrivibe-green transition-colors">
                            {position.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {position.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {position.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {position.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {position.salary}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">
                          {position.posted}
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all hover:scale-105">
                          Apply Now
                        </button>
                      </div>
                    </div>

                    {/* Expanded Description */}
                    <AnimatePresence>
                      {selectedJob === position.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                              {position.description}
                            </p>
                            <button className="mt-3 text-agrivibe-green font-medium text-sm hover:underline flex items-center gap-1">
                              Learn more
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ====== APPLICATION PROCESS ====== */}
      <div className="py-16 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <UserCheck className="w-4 h-4" />
              How to Apply
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Our{" "}
              <span className="text-gradient-green">Application Process</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {process.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {index < 3 && (
                        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200" />
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{step.step}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {index === 0 && "Submit your application online"}
                      {index === 1 && "Meet our team for a conversation"}
                      {index === 2 && "Showcase your skills"}
                      {index === 3 && "Welcome to the team!"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== TESTIMONIALS ====== */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Quote className="w-4 h-4" />
              Employee Stories
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Voices from <span className="text-gradient-green">Our Team</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
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

      {/* ====== CTA ====== */}
      <div className="py-16 bg-gradient-to-r from-agrivibe-green to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-4">
              <Send className="w-4 h-4" />
              Ready to Make an Impact?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Join the <span className="text-yellow-300">AgriVibe Team</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-3">
              Be part of something bigger. Help us transform agriculture in
              Africa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <a
                href="mailto:careers@agrivibe.com"
                className="inline-flex items-center gap-2 bg-white text-agrivibe-green px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Send CV
              </a>
              <a
                href="tel:+254769074319"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
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
                  <MapPinIcon className="w-4 h-4 text-agrivibe-green" />
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
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
