// src/pages/checkout.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Wallet,
  Smartphone,
  Shield,
  Sparkles,
  Clock,
  Package,
  ChevronRight,
  AlertCircle,
  ChevronLeft,
  Lock,
  User,
} from "lucide-react";
import api from "../services/api";

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    county: "",
    phone: "",
    paymentMethod: "mpesa",
    notes: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get("/cart");
      const items = response.data.items || [];
      setCartItems(items);
      const sub = response.data.subtotal || 0;
      setSubtotal(sub);
      const fee = sub > 1000 ? 0 : 150;
      setDeliveryFee(fee);
      setTotal(sub + fee);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/orders/checkout", {
        delivery_address: `${formData.address}, ${formData.city}, ${formData.county}`,
        delivery_notes: formData.notes,
        payment_method: formData.paymentMethod,
        phone: formData.phone,
      });
      alert("✅ Order placed successfully!");
      router.push("/dashboard/orders");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Delivery", icon: MapPin },
    { number: 2, label: "Payment", icon: CreditCard },
    { number: 3, label: "Confirm", icon: CheckCircle },
  ];

  const paymentMethods = [
    {
      value: "mpesa",
      label: "M-Pesa",
      icon: Smartphone,
      description: "Pay with M-Pesa",
    },
    {
      value: "card",
      label: "Card",
      icon: CreditCard,
      description: "Credit/Debit Card",
    },
    {
      value: "wallet",
      label: "Wallet",
      icon: Wallet,
      description: "Use wallet balance",
    },
  ];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-agrivibe-green/15 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-agrivibe-gold/10 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Phone Frame Container - Larger */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative w-full max-w-[480px] max-h-[90vh]"
      >
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-4 shadow-2xl shadow-black/50 border border-white/10 h-full">
          <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 rounded-[2.5rem] overflow-hidden border border-white/5 h-full flex flex-col">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <span>9:41</span>
                <span className="text-xs">📶</span>
                <span className="text-xs">🔋</span>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push("/cart")}
              className="absolute top-14 left-4 z-20 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* ====== SCROLLABLE CONTENT ====== */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-6 pt-16 pb-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-agrivibe-green/30 flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Checkout</h1>
                  <p className="text-xs text-gray-400">
                    {cartItems.length} items • Complete your order
                  </p>
                </div>
              </div>

              {/* ====== STEPS ====== */}
              <div className="flex items-center justify-between gap-1 mb-6">
                {steps.map((s, index) => {
                  const Icon = s.icon;
                  const isActive = step === s.number;
                  const isCompleted = step > s.number;

                  return (
                    <div
                      key={s.number}
                      className="flex items-center gap-1 flex-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 flex-shrink-0
                          ${isActive ? "bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30 scale-110" : ""}
                          ${isCompleted ? "bg-green-500 text-white" : ""}
                          ${!isActive && !isCompleted ? "bg-white/5 text-gray-500" : ""}
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            s.number
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-medium hidden sm:inline ${
                            isActive ? "text-agrivibe-green" : "text-gray-500"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div
                          className={`flex-1 h-0.5 rounded-full transition-all duration-300 mx-1 ${
                            isCompleted ? "bg-green-500" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ====== MAIN FORM ====== */}
              <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                <AnimatePresence mode="wait">
                  {/* Step 1: Delivery */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-white">
                            Delivery Address
                          </h2>
                          <p className="text-[10px] text-gray-400">
                            Where should we deliver?
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Street Address *
                        </label>
                        <input
                          name="address"
                          placeholder="e.g., 123 Main Street"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-agrivibe-green transition-all text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            City *
                          </label>
                          <input
                            name="city"
                            placeholder="Nairobi"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-agrivibe-green transition-all text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            County *
                          </label>
                          <input
                            name="county"
                            placeholder="Kiambu"
                            value={formData.county}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-agrivibe-green transition-all text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Phone Number *
                        </label>
                        <input
                          name="phone"
                          placeholder="254700000000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-agrivibe-green transition-all text-sm"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-white">
                            Payment Method
                          </h2>
                          <p className="text-[10px] text-gray-400">
                            Choose how to pay
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          const isSelected =
                            formData.paymentMethod === method.value;
                          return (
                            <label
                              key={method.value}
                              className={`
                                flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-300
                                ${
                                  isSelected
                                    ? "border-agrivibe-green bg-agrivibe-green/10 shadow-lg shadow-agrivibe-green/10"
                                    : "border-white/10 hover:border-white/20 bg-white/5"
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={isSelected}
                                onChange={handleChange}
                                className="w-3.5 h-3.5 text-agrivibe-green focus:ring-agrivibe-green"
                              />
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                  isSelected
                                    ? "bg-agrivibe-green text-white"
                                    : "bg-white/5 text-gray-400"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-semibold ${isSelected ? "text-agrivibe-green" : "text-white"}`}
                                >
                                  {method.label}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {method.description}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-agrivibe-green flex-shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Delivery Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          rows={2}
                          placeholder="Special instructions..."
                          value={formData.notes}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-agrivibe-green transition-all text-sm resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-gray-400 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                        >
                          Review Order
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirm */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-white">
                            Confirm Order
                          </h2>
                          <p className="text-[10px] text-gray-400">
                            Review before placing
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Items</span>
                          <span className="font-medium text-white">
                            {cartItems.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-medium text-white">
                            KES {subtotal}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Delivery</span>
                          <span
                            className={`font-medium ${deliveryFee === 0 ? "text-green-400" : "text-white"}`}
                          >
                            {deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}
                          </span>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-white">Total</span>
                            <span className="text-xl font-bold text-agrivibe-green">
                              KES {total}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 rounded-xl p-3 space-y-1.5 border border-blue-500/20">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-xs">
                            {formData.address}, {formData.city},{" "}
                            {formData.county}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-xs capitalize">
                            {formData.paymentMethod}
                          </span>
                        </div>
                        {formData.notes && (
                          <div className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-xs">
                              {formData.notes}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-gray-400 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          onClick={handleSubmit}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                              Placing...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              Place Order
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ====== ORDER SUMMARY MINI ====== */}
              <div className="mt-4 bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Order Summary</span>
                  <span className="text-xs font-bold text-white">
                    KES {total}
                  </span>
                </div>
                <div className="max-h-20 overflow-y-auto space-y-1">
                  {cartItems.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-gray-400 truncate max-w-[150px]">
                        {item.Product?.name || "Product"}{" "}
                        <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span className="text-white">
                        KES {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-[10px] text-gray-500">
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-agrivibe-green" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-agrivibe-green" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-agrivibe-green" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-10" />
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-4">
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
