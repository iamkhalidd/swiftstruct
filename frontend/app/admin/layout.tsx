'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Home,
  HardHat,
  Inbox,
  Briefcase,
  BookOpen,
  Users,
  Image,
  LogOut,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import { removeAuthToken, getAuthToken } from '@/lib/adminApi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isLoginPage) {
      const token = getAuthToken();
      if (!token) {
        router.push('/admin/login');
      } else {
        const storedUser = localStorage.getItem('ss_admin_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {}
        }
      }
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/admin/properties', icon: Home },
    { name: 'Projects', href: '/admin/projects', icon: HardHat },
    { name: 'Enquiries & Leads', href: '/admin/enquiries', icon: Inbox },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Insights', href: '/admin/insights', icon: BookOpen },
    { name: 'Testimonials', href: '/admin/testimonials', icon: UserCheck },
    { name: 'Media Library', href: '/admin/media', icon: Image },
    { name: 'Users & Staff', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight block">SWIFTSTRUCT</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Admin CMS</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          {user && (
            <div className="text-xs">
              <span className="block text-slate-400">Signed in as</span>
              <span className="font-bold text-white truncate block">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="font-bold text-slate-900 text-base">SwiftStruct Management System</h1>
          </div>

          <Link href="/" target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
            View Public Website &rarr;
          </Link>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-900 text-white px-4 py-4 space-y-2 border-b border-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-xs font-bold rounded hover:bg-slate-800"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
