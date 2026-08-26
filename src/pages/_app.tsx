import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // 🟢 Import the router to track the current page path
import Head from 'next/head';
import { MessageCircle } from 'lucide-react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter(); // 🟢 Initialize Next.js router instance
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  // 🟢 CONDITION: Return true if the user is anywhere on an administrative dashboard path
  const isAdminRoute = router.pathname.startsWith('/admin');

  // CONFIGURATION: Set your company's operational support number
  const whatsappNumber = "254700000000";
  const preFilledMessage = encodeURIComponent("Hello AgriVibe! I would like to make an inquiry.");
  const targetUrl = `https://wa.me{whatsappNumber}?text=${preFilledMessage}`;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <title>AgriVibe</title>
      </Head>

      {/* Render core screen layouts */}
      <Component {...pageProps} />

      {/* 🟢 CONDITIONAL FLOATING CLICK-TO-CHAT WHATSAPP WIDGET */}
      {/* It will render on the landing page/marketplace, but stay completely hidden for admins */}
      {isMounted && !isAdminRoute && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95"
          style={{
            boxShadow: '0 4px 14px 0 rgba(37, 211, 102, 0.4)'
          }}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
        </a>
      )}
    </>
  );
}
