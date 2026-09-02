// src/pages/dashboard/wallet.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Wallet as WalletIcon,
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
  Send,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Copy,
  Gift,
  ShoppingBag,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

export default function Wallet() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  // ============================================
  // ✅ FETCH WALLET - REAL API (Customer Only)
  // ============================================
  const fetchWallet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get("/wallet/balance");
      const data = response.data;
      setBalance(data.balance || 0);
      setError("");
    } catch (error: any) {
      console.error("Failed to fetch wallet:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      } else {
        setError(error.response?.data?.error || "Failed to load wallet data");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ FETCH TRANSACTIONS - REAL API
  // ============================================
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.get("/wallet/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error: any) {
      console.error("Failed to fetch transactions:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  // ============================================
  // ✅ ADD FUNDS - REAL API (Customer Only)
  // ============================================
  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      setAddError("Please enter a valid amount");
      return;
    }

    setAdding(true);
    setAddError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.post("/wallet/add-funds", {
        amount: amount,
        payment_method: "mpesa",
      });

      if (response.data.message) {
        setSuccessMessage("✅ Funds added successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowAddFundsModal(false);
          setAddAmount("");
          fetchWallet();
          fetchTransactions();
        }, 2000);
      }
    } catch (error: any) {
      setAddError(error.response?.data?.error || "Failed to add funds");
    } finally {
      setAdding(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      credit: TrendingUp,
      debit: TrendingDown,
      pending: Clock,
      completed: CheckCircle,
      failed: AlertCircle,
    };
    return icons[type?.toLowerCase()] || Clock;
  };

  const getTransactionColor = (type: string) => {
    const colors: Record<string, string> = {
      credit: "text-green-500 bg-green-50",
      debit: "text-red-500 bg-red-50",
      pending: "text-yellow-500 bg-yellow-50",
      completed: "text-green-500 bg-green-50",
      failed: "text-red-500 bg-red-50",
    };
    return colors[type?.toLowerCase()] || "text-gray-500 bg-gray-50";
  };

  const filteredTransactions =
    selectedPeriod === "all"
      ? transactions
      : transactions.filter((t: any) => {
          const date = new Date(t.created_at);
          const now = new Date();
          if (selectedPeriod === "week") {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return date >= weekAgo;
          }
          if (selectedPeriod === "month") {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return date >= monthAgo;
          }
          return true;
        });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading wallet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-500 mt-1">
              Manage your balance and transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddFundsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add Funds
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
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span className="text-sm font-medium text-green-700">
                {successMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== BALANCE CARD ====== */}
        <div className="grid grid-cols-1 gap-6">
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
                <WalletIcon className="w-5 h-5" />
                <span>Available Balance</span>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white">
                {formatCurrency(balance)}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddFundsModal(true)}
                  className="bg-white text-agrivibe-green px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  + Add Funds
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ====== CUSTOMER STATS (No Vendor Data) ====== */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(0)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="text-xl font-bold text-green-600">
              {transactions.length}
            </p>
          </motion.div>
        </div>

        {/* ====== TRANSACTIONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-agrivibe-green" />
              <h3 className="text-lg font-bold text-gray-900">
                Transaction History
              </h3>
            </div>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-agrivibe-green outline-none transition-all cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredTransactions.map((transaction: any, index: number) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);
                  const isCredit =
                    transaction.type === "credit" ||
                    transaction.type === "completed";

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description || transaction.type}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              transaction.created_at,
                            ).toLocaleDateString()}
                            <span className="text-gray-300">•</span>
                            {new Date(
                              transaction.created_at,
                            ).toLocaleTimeString()}
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
                        <p className="text-xs text-gray-400 capitalize">
                          {transaction.status || "completed"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ====== SECURITY NOTE ====== */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                💳 All transactions are securely processed and encrypted.
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your funds are safe and protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== ADD FUNDS MODAL ====== */}
      <AnimatePresence>
        {showAddFundsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Add Funds
                      </h2>
                      <p className="text-white/80 text-sm">
                        Deposit money into your wallet
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddFundsModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="text-2xl font-bold text-agrivibe-green">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        KES
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setAddAmount(amount.toString())}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        KES {amount}
                      </button>
                    ))}
                  </div>

                  {addError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{addError}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddFundsModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFunds}
                      disabled={
                        adding || !addAmount || parseFloat(addAmount) <= 0
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {adding ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Funds
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
    </DashboardLayout>
  );
}
