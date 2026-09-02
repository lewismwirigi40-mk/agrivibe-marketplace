import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

export default function PendingApproval() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // ✅ Prevent multiple redirects

  // ====== CHECK VENDOR STATUS ======
  useEffect(() => {
    // ✅ Clear any redirect flags when on pending page
    localStorage.removeItem("isRedirecting");

    checkVendorStatus(true);

    const statusPollingInterval = setInterval(() => {
      // ✅ Only poll if not already redirecting
      if (!isRedirecting) {
        checkVendorStatus(false);
      }
    }, 10000);

    return () => clearInterval(statusPollingInterval);
  }, []);

  const checkVendorStatus = async (showLoader = false) => {
    // ✅ Prevent multiple simultaneous checks
    if (isRedirecting) return;

    try {
      if (showLoader) setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/vendor/status");

      if (response.data && response.data.vendor) {
        const vendor = response.data.vendor;
        setVendorData(vendor);

        // ✅ Check if vendor is approved
        if (
          vendor.is_approved === true ||
          vendor.is_active === true ||
          vendor.status === "approved"
        ) {
          console.log("✅ Shop approved! Redirecting to dashboard...");

          // ✅ Set flag to prevent multiple redirects
          setIsRedirecting(true);
          localStorage.setItem("vendorStatus", "approved");
          localStorage.removeItem("isRedirecting");

          // ✅ Use replace to prevent back button loop
          router.replace("/vendor/dashboard");
          return;
        }
      }

      setError("");
    } catch (error: any) {
      console.error("Failed to check vendor status:", error);

      if (error.response?.status === 404) {
        router.push("/vendor/register");
        return;
      }

      setError(
        error.response?.data?.error || "Failed to load status. Sync delayed.",
      );
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (isRedirecting) return; // ✅ Don't refresh if already redirecting
    setRefreshing(true);
    await checkVendorStatus(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Checking your application status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-emerald-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-green-200/30 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-md bg-white/90 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] border border-white/60 max-w-lg w-full text-center"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          Application Under Review
        </div>

        {/* Hero Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-amber-400/10 rounded-full animate-ping opacity-70 duration-1000" />
          <div className="absolute inset-2 bg-amber-400/20 rounded-full animate-pulse duration-700" />
          <div className="relative w-full h-full bg-gradient-to-tr from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)]">
            <Clock className="w-10 h-10 stroke-[2.2]" />
          </div>
        </div>

        {/* Typography */}
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          Shop Review Pending
        </h2>

        <p className="text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-8">
          Your <span className="font-semibold text-emerald-600">AgriVibe</span>{" "}
          vendor application is currently being verified by our administration
          safety team. You will receive an instant{" "}
          <span className="font-semibold text-slate-800">SMS alert</span> once
          activated!
        </p>

        {/* Vendor Data Display */}
        {vendorData && (
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6 text-left">
            <p className="text-sm text-slate-500 mb-1">Application Details</p>
            <p className="font-semibold text-slate-800">
              {vendorData.store_name ||
                vendorData.business_name ||
                "AgriVibe Storefront"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Submitted:{" "}
              {vendorData.created_at
                ? new Date(vendorData.created_at).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  vendorData.is_approved || vendorData.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                Status:{" "}
                {vendorData.is_approved || vendorData.is_active
                  ? "Approved ✅"
                  : "Pending Verification ⏳"}
              </span>
            </div>
          </div>
        )}

        {/* Metrics Brief */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 mb-8 text-left">
          <div className="flex gap-2.5 items-start">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">Secure Vault</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Data fully verified
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">Need Help?</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Contact support desk
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={handleRefresh}
            disabled={refreshing || isRedirecting}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Checking..." : "Check Status"}
          </button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Error Display */}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      </motion.div>
    </div>
  );
}
