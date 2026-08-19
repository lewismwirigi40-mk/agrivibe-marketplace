import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-400">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Vendors', href: '/admin/vendors', icon: '🏪' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '📋' },
    { name: 'Guides', href: '/admin/guides', icon: '📚' },
    { name: 'Profile', href: '/admin/profile', icon: '👤' },
    { name: 'Payments', href: '/admin/payments', icon: '💰' },
    { name: 'Unanswered Questions', href: '/admin/unanswered', icon: '❓' }, // ← ADD THIS
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Reports', href: '/admin/reports', icon: '📄' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
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

