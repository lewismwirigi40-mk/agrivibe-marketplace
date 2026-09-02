import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MessageCircle } from "lucide-react";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }

    // ✅ REGISTER SERVICE WORKER (PWA)
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  // Check if admin route
  const isAdminRoute = router.pathname.startsWith("/admin");

  // WhatsApp Configuration
  const whatsappNumber = "254769074319";
  const preFilledMessage = encodeURIComponent(
    "Hello AgriVibe! I would like to make an inquiry.",
  );
  const targetUrl = `https://wa.me/${whatsappNumber}?text=${preFilledMessage}`;

  return (
    <>
      <Head>
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ Theme Color */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="AgriVibe" />

        {/* ✅ Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* ✅ Title */}
        <title>AgriVibe - Kenya's Premier Agri-Marketplace</title>

        {/* ✅ Meta Description */}
        <meta
          name="description"
          content="AgriVibe is Africa's leading agricultural technology platform, revolutionizing the way fresh produce moves from farm to table."
        />
      </Head>

      {/* Render core screen layouts */}
      <Component {...pageProps} />

      {/* ✅ Conditional Floating WhatsApp Widget */}
      {isMounted && !isAdminRoute && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95"
          style={{
            boxShadow: "0 4px 14px 0 rgba(37, 211, 102, 0.4)",
          }}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
        </a>
      )}
    </>
  );
}
