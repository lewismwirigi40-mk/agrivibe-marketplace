// src/pages/admin/unanswered.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  Award,
  Users,
  Calendar,
  User,
  Mail,
  Phone,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Bot,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Star
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function UnansweredQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/ai/unanswered');
      setQuestions(response.data.questions || []);
    } catch (error: any) {
      console.error('Failed to fetch questions:', error);
      setError(error.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id: string) => {
    if (!answerText.trim()) {
      setError('Please enter an answer');
      return;
    }
    
    setError('');
    try {
      await api.put(`/ai/unanswered/${id}`, { answer: answerText });
      setAnswering(null);
      setAnswerText('');
      setSuccessMessage('✅ Answer submitted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchQuestions();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to answer question');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'general': MessageCircle,
      'product': ShoppingBag,
      'delivery': Truck,
      'payment': CreditCard,
      'vendor': Store,
      'technical': Bot,
      'other': HelpCircle,
    };
    return icons[category?.toLowerCase()] || HelpCircle;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'general': 'from-blue-500 to-blue-600',
      'product': 'from-green-500 to-emerald-500',
      'delivery': 'from-orange-500 to-orange-600',
      'payment': 'from-yellow-500 to-yellow-600',
      'vendor': 'from-purple-500 to-purple-600',
      'technical': 'from-cyan-500 to-cyan-600',
      'other': 'from-gray-500 to-gray-600',
    };
    return colors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const filteredQuestions = questions
    .filter(q => {
      const matchesSearch = 
        q.question?.toLowerCase().includes(search.toLowerCase()) ||
        q.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        q.customer?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || q.category === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.asked_at || 0).getTime() - new Date(b.asked_at || 0).getTime());

  const stats = {
    total: questions.length,
    urgent: questions.filter(q => q.is_urgent).length,
    general: questions.filter(q => q.category === 'general').length,
    product: questions.filter(q => q.category === 'product').length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading questions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">❓ Unanswered Questions</h1>
            <p className="text-gray-500 mt-1">Review and answer customer questions</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              questions.length > 0 
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <Clock className="w-4 h-4" />
              {questions.length} Pending
            </span>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pending', value: stats.total, icon: MessageCircle, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Urgent', value: stats.urgent, icon: AlertCircle, color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
            { label: 'General', value: stats.general, icon: HelpCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Product', value: stats.product, icon: Package, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions or customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="product">Product</option>
                <option value="delivery">Delivery</option>
                <option value="payment">Payment</option>
                <option value="vendor">Vendor</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== QUESTIONS LIST ====== */}
        {filteredQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            {questions.length === 0 ? (
              <>
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">All questions answered!</h3>
                <p className="text-gray-500 text-lg">Great job! No pending questions.</p>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No matching questions</h3>
                <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  className="mt-4 text-agrivibe-green font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredQuestions.map((q, index) => {
                const Icon = getCategoryIcon(q.category);
                const color = getCategoryColor(q.category);
                const isUrgent = q.is_urgent;
                const isAnswering = answering === q.id;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 ${
                      isUrgent 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Question Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-medium text-gray-900">{q.question}</h3>
                              {isUrgent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                  🔴 Urgent
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {q.customer?.name || 'Anonymous'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(q.asked_at).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {q.category || 'General'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      </div>
                    </div>

                    {/* Answer Section */}
                    {isAnswering ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Your Answer
                          </label>
                          <textarea
                            placeholder="Type your answer here..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all duration-300 resize-none"
                            rows={3}
                            autoFocus
                          />
                        </div>
                        {error && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAnswer(q.id)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105"
                          >
                            <Send className="w-4 h-4" />
                            Submit Answer
                          </button>
                          <button
                            onClick={() => {
                              setAnswering(null);
                              setAnswerText('');
                              setError('');
                            }}
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => {
                          setAnswering(q.id);
                          setError('');
                        }}
                        className="mt-4 inline-flex items-center gap-2 text-agrivibe-green hover:text-emerald-600 font-medium transition-colors group"
                      >
                        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Answer Question
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ====== QUESTION COUNT ====== */}
        {filteredQuestions.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {filteredQuestions.length} of {questions.length} pending questions
          </div>
        )}

        {/* ====== AI ASSISTANT CTA ====== */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">💡 AI Assistant Available</p>
                <p className="text-xs text-gray-500">Use AI to suggest answers for questions</p>
              </div>
              <button className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium">
                Try AI Suggestion →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

// Add missing imports
import { ShoppingBag, Truck, CreditCard, Store, Package } from 'lucide-react';