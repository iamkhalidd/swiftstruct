'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Squares2X2Icon,
  HomeIcon,
  WrenchScrewdriverIcon,
  InboxIcon,
  BriefcaseIcon,
  BookOpenIcon,
  UsersIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { SwiftStructMark } from '@/components/icons/BrandIcons';
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
    { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon },
    { name: 'Properties', href: '/admin/properties', icon: HomeIcon },
    { name: 'Projects', href: '/admin/projects', icon: WrenchScrewdriverIcon },
    { name: 'Enquiries & Leads', href: '/admin/enquiries', icon: InboxIcon },
    { name: 'Services', href: '/admin/services', icon: BriefcaseIcon },
    { name: 'Insights', href: '/admin/insights', icon: BookOpenIcon },
    { name: 'Testimonials', href: '/admin/testimonials', icon: UserCircleIcon },
    { name: 'Media Library', href: '/admin/media', icon: PhotoIcon },
    { name: 'Users & Staff', href: '/admin/users', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex text-neutral-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-200">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-bold text-white">
            <SwiftStructMark className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight block">SWIFTSTRUCT</span>
            <span className="text-[10px] text-neutral-500 uppercase font-semibold">Admin CMS</span>
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
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 space-y-3">
          {user && (
            <div className="text-xs">
              <span className="block text-neutral-500">Signed in as</span>
              <span className="font-bold text-neutral-900 truncate block">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-red-600 text-neutral-700 hover:text-white rounded-lg text-xs font-bold transition"
          >
            <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
            >
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <h1 className="font-bold text-neutral-900 text-base">SwiftStruct Management System</h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold text-neutral-900 hover:underline"
          >
            View Public Website &rarr;
          </Link>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white text-neutral-900 px-4 py-4 space-y-2 border-b border-neutral-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-xs font-bold rounded hover:bg-neutral-100"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-neutral-100"
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
