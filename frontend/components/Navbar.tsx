'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { SwiftStructMark } from '@/components/icons/BrandIcons';

const NAV_LINKS = [
  { href: '/properties', label: 'Properties' },
  { href: '/projects', label: 'Projects Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 text-neutral-900">
      <div className="container-custom flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg transition group-hover:bg-neutral-800">
            <SwiftStructMark className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-neutral-900 transition group-hover:text-neutral-600">
              SWIFTSTRUCT
            </span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Real Estate & Construction
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/properties"
            className="px-4 py-2 text-sm font-medium text-neutral-800 border border-neutral-300 rounded-md hover:bg-neutral-100 transition flex items-center gap-1.5"
          >
            Explore Properties
          </Link>
          <Link
            href="/contact?type=brief"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-md hover:bg-neutral-800 transition flex items-center gap-1.5"
          >
            Start a Project <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium text-neutral-800">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-black py-1 transition flex items-center justify-between"
              >
                {link.label} <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
            <Link
              href="/properties"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 border border-neutral-300 text-neutral-800 rounded-md font-medium hover:bg-neutral-100"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact?type=brief"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-black text-white rounded-md font-semibold hover:bg-neutral-800"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
