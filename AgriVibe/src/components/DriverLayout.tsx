import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import Navbar from './Navbar';

interface DriverLayoutProps {
  children: ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/driver/dashboard', icon: '📊' },
    { name: 'My Deliveries', href: '/driver/deliveries', icon: '📦' },
    { name: 'Profile', href: '/driver/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-20 flex">
        <aside className={`fixed left-0 top-20 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  router.pathname === item.href
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 md:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 left-6 z-50 md:hidden bg-yellow-400 text-gray-900 p-3 rounded-full shadow-lg"
      >
        ☰
      </button>
    </div>
  );
}