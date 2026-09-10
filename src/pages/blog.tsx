// src/pages/blog.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  Sparkles,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  const posts = [
    {
      id: 1,
      title: "The Future of Agriculture in Kenya",
      excerpt:
        "How technology is transforming farming and creating new opportunities for farmers across the country.",
      author: "Dr. James Mwangi",
      date: "August 28, 2026",
      readTime: "5 min read",
      category: "Agriculture",
      image: "🌾",
      likes: 342,
      comments: 28,
    },
    {
      id: 2,
      title: "Why Campus-Based Marketplaces are the Future",
      excerpt:
        "Understanding how university students are driving the demand for fresh, locally-sourced produce.",
      author: "Sarah Kariuki",
      date: "August 25, 2026",
      readTime: "4 min read",
      category: "Marketplace",
      image: "📚",
      likes: 215,
      comments: 18,
    },
    {
      id: 3,
      title: "Sustainable Farming Practices for Smallholders",
      excerpt:
        "Practical tips for small-scale farmers to increase yields while protecting the environment.",
      author: "Peter Otieno",
      date: "August 20, 2026",
      readTime: "6 min read",
      category: "Farming",
      image: "🌱",
      likes: 189,
      comments: 15,
    },
    {
      id: 4,
      title: "The Rise of AgriTech in Africa",
      excerpt:
        "How startups are using technology to solve agriculture's biggest challenges on the continent.",
      author: "Grace Wanjiru",
      date: "August 15, 2026",
      readTime: "7 min read",
      category: "Technology",
      image: "🚀",
      likes: 267,
      comments: 22,
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* ====== HEADER ====== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20 mb-6">
              <Sparkles className="w-4 h-4" />
              AgriVibe Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stories from the <span className="text-yellow-300">AgriVibe</span>{" "}
              Community
            </h1>
            <p className="text-white/80 text-lg">
              Insights, news, and stories about agriculture, technology, and the
              people shaping the future of food.
            </p>

            {/* Search */}
            <div className="relative mt-8 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-white/30 outline-none shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====== BLOG POSTS ====== */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800">No posts found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{post.image}</span>
                    <span className="text-xs font-medium text-agrivibe-green bg-green-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-agrivibe-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-500 transition-colors ml-auto">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
