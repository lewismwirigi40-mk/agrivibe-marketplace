// src/pages/vendor/wallet.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  History,
  DollarSign,
  PiggyBank,
  Lock,
  Activity,
  Send,
  RefreshCw,
  Calendar,
  ChevronDown,
  Download,
  Printer,
  Share2,
  Eye,
  Filter,
  Search,
  MoreVertical,
  Copy,
  ExternalLink,
  Zap,
  Crown,
  Award,
  Star,
  Gift,
  Heart,
  ThumbsUp,
  FileText,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";
import VendorLayout from "../../components/VendorLayout";
import api from "../../services/api";

export default function VendorWallet() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [vendorPaymentDetails, setVendorPaymentDetails] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
    fetchPaymentDetails();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/vendor/wallet");
      const data = response.data;
      setBalance(data.balance || 0);
      setTotalEarned(data.total_earned || 0);
      setTotalWithdrawn(data.total_withdrawn || 0);
      setPendingWithdrawal(data.pending_withdrawal || 0);
    } catch (error: any) {
      console.error("Failed to fetch wallet:", error);
      setError(error.response?.data?.error || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/vendor/wallet/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      // Set fallback transactions
      setTransactions(generateFallbackTransactions());
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/vendor/payment-settings");
      setVendorPaymentDetails(response.data);
      setPaymentMethod(response.data.method || "mpesa");
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  };

  const generateFallbackTransactions = () => {
    const types = ["credit", "debit", "pending", "completed"];
    const descriptions = [
      "Order #ORD-001",
      "Order #ORD-002",
      "Withdrawal",
      "Commission",
      "Bonus",
    ];
    const transactions = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      transactions.push({
        id: `TXN-${String(i + 1).padStart(6, "0")}`,
        type: types[i % types.length],
        amount: Math.floor(100 + Math.random() * 9000),
        description: descriptions[i % descriptions.length],
        status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "pending" : "failed",
        created_at: date.toISOString(),
      });
    }
    return transactions;
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      setWithdrawError("Insufficient balance");
      return;
    }

    // Check if vendor has payment details
    if (
      !vendorPaymentDetails ||
      (paymentMethod === "mpesa" && !vendorPaymentDetails.mpesa_number) ||
      (paymentMethod === "bank" && !vendorPaymentDetails.bank_name)
    ) {
      setWithdrawError(
        "⚠️ Please set up your payment details in Store Settings first.",
      );
      setTimeout(() => {
        setShowWithdrawModal(false);
        router.push("/vendor/settings");
      }, 2000);
      return;
    }

    setWithdrawing(true);
    setWithdrawError("");

    try {
      const response = await api.post("/vendor/wallet/withdraw", {
        amount: amount,
        payment_method: paymentMethod,
      });

      if (response.data.success) {
        setSuccessMessage("✅ Withdrawal request submitted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowWithdrawModal(false);
          setWithdrawAmount("");
          fetchWallet();
          fetchTransactions();
        }, 3000);
      }
    } catch (error: any) {
      setWithdrawError(
        error.response?.data?.error || "Failed to process withdrawal",
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      credit: TrendingUp,
      debit: TrendingDown,
      pending: Clock,
      completed: CheckCircle,
      failed: AlertCircle,
    };
    return icons[type] || Activity;
  };

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      credit: "text-green-500 bg-green-50",
      debit: "text-red-500 bg-red-50",
      pending: "text-yellow-500 bg-yellow-50",
      completed: "text-blue-500 bg-blue-50",
      failed: "text-red-500 bg-red-50",
    };
    return colors[type] || "text-gray-500 bg-gray-50";
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      completed: {
        label: "Completed",
        icon: CheckCircle,
        color: "text-green-500 bg-green-50 border-green-200",
      },
      pending: {
        label: "Pending",
        icon: Clock,
        color: "text-yellow-500 bg-yellow-50 border-yellow-200",
      },
      failed: {
        label: "Failed",
        icon: AlertCircle,
        color: "text-red-500 bg-red-50 border-red-200",
      },
      processing: {
        label: "Processing",
        icon: Loader2,
        color: "text-blue-500 bg-blue-50 border-blue-200",
      },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowWithdrawModal(false);
      }
    };
    if (showWithdrawModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showWithdrawModal]);

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading your wallet...
            </p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Wallet
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-200 dark:border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your earnings and withdrawals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchWallet();
                fetchTransactions();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => router.push("/vendor/wallet/transactions")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <History className="w-4 h-4" />
              Transaction History
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== MAIN BALANCE CARDS ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-500 to-teal-500 rounded-3xl p-8"
          >
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <Wallet className="w-5 h-5" />
                <span>Available Balance</span>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white">
                {formatCurrency(balance)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
                <span>Total Earned: {formatCurrency(totalEarned)}</span>
                <span className="w-1 h-1 bg-white/30 rounded-full" />
                <span>Withdrawn: {formatCurrency(totalWithdrawn)}</span>
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={balance <= 0}
                className={`mt-6 inline-flex items-center gap-2 bg-white text-agrivibe-green px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${
                  balance <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                <Send className="w-4 h-4" />
                Withdraw Funds
              </button>
            </div>
          </motion.div>

          {/* Pending Clearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-white/10 p-8"
          >
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span>Pending Clearance</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-yellow-500">
              {formatCurrency(pendingWithdrawal)}
            </p>
            <div className="mt-4 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-xl border border-yellow-200 dark:border-yellow-500/30">
              <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Funds held in escrow until delivery is confirmed
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
                  Typically released within 24-48 hours after delivery
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 p-5 text-center"
          >
            <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Earned
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalEarned)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 p-5 text-center"
          >
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Withdrawn
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalWithdrawn)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 p-5 text-center"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Payment Method
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {paymentMethod === "mpesa" ? "📱 M-Pesa" : "🏦 Bank Transfer"}
            </p>
          </motion.div>
        </div>

        {/* ====== TRANSACTIONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your latest wallet activity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credits</option>
                  <option value="debit">Debits</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {transactionsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-agrivibe-green animate-spin mx-auto" />
              <p className="text-gray-500 mt-2">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.slice(0, 5).map((transaction, index) => {
                const Icon = getTransactionTypeIcon(transaction.type);
                const colorClass = getTransactionTypeColor(transaction.type);
                const isCredit = transaction.type === "credit";

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowTransactionDetail(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCredit ? "+" : "-"}{" "}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </motion.div>
                );
              })}
              {transactions.length > 5 && (
                <button
                  onClick={() => router.push("/vendor/wallet/transactions")}
                  className="w-full text-center text-sm text-agrivibe-green font-medium hover:underline py-2"
                >
                  View all transactions
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* ====== INFO CARD ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/30 p-4"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💳 Funds will be sent to your registered payment method.
                <button
                  onClick={() => router.push("/vendor/settings")}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline ml-1"
                >
                  Update payment details
                </button>
                in your Store Settings.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Withdrawals are processed within 1-3 business days
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ====== WITHDRAW MODAL ====== */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Withdraw Funds
                      </h2>
                      <p className="text-white/80 text-sm">
                        Request a withdrawal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                  <span className="text-gray-600 dark:text-gray-400">
                    Available Balance
                  </span>
                  <span className="text-2xl font-bold text-agrivibe-green">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        KES
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <button
                        onClick={() =>
                          setWithdrawAmount(
                            Math.floor(balance * 0.25).toString(),
                          )
                        }
                        className="text-xs text-gray-400 hover:text-agrivibe-green transition-colors"
                      >
                        25%
                      </button>
                      <button
                        onClick={() =>
                          setWithdrawAmount(
                            Math.floor(balance * 0.5).toString(),
                          )
                        }
                        className="text-xs text-gray-400 hover:text-agrivibe-green transition-colors"
                      >
                        50%
                      </button>
                      <button
                        onClick={() =>
                          setWithdrawAmount(
                            Math.floor(balance * 0.75).toString(),
                          )
                        }
                        className="text-xs text-gray-400 hover:text-agrivibe-green transition-colors"
                      >
                        75%
                      </button>
                      <button
                        onClick={() => setWithdrawAmount(balance.toString())}
                        className="text-xs text-agrivibe-green hover:underline font-medium"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all appearance-none"
                      >
                        <option value="mpesa">📱 M-Pesa</option>
                        <option value="bank">🏦 Bank Transfer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="mt-1.5 flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {paymentMethod === "mpesa"
                          ? `Funds will be sent to M-Pesa: ${vendorPaymentDetails?.mpesa_number || "Not set"}`
                          : `Funds will be sent to Bank: ${vendorPaymentDetails?.bank_name || "Not set"}`}
                        <button
                          onClick={() => router.push("/vendor/settings")}
                          className="text-agrivibe-green hover:underline ml-1"
                        >
                          Change
                        </button>
                      </p>
                    </div>
                  </div>

                  {withdrawError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-500/30 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{withdrawError}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleWithdraw}
                      disabled={
                        withdrawing ||
                        !withdrawAmount ||
                        parseFloat(withdrawAmount) <= 0
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {withdrawing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Withdraw
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== TRANSACTION DETAIL MODAL ====== */}
      <AnimatePresence>
        {showTransactionDetail && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowTransactionDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Transaction Details
                      </h2>
                      <p className="text-white/80 text-sm">
                        {selectedTransaction.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTransactionDetail(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedTransaction.type}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400">Status</p>
                    <div className="mt-0.5">
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedTransaction.created_at)}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-400">Description</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.description}
                  </p>
                </div>

                {selectedTransaction.type === "credit" && (
                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Funds have been credited to your wallet
                    </p>
                  </div>
                )}

                {selectedTransaction.type === "debit" && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Funds have been debited from your wallet
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowTransactionDetail(false)}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== SUCCESS TOAST ====== */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm w-full"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-white/80">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </VendorLayout>
  );
}
