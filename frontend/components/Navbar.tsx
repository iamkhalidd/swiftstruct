'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Menu, X, ChevronRight, Phone, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="container-custom flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg shadow-md group-hover:bg-blue-500 transition">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition">
              SWIFTSTRUCT
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Real Estate & Construction
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <Link href="/properties" className="text-slate-300 hover:text-white transition">
            Properties
          </Link>
          <Link href="/projects" className="text-slate-300 hover:text-white transition">
            Projects Portfolio
          </Link>
          <Link href="/services" className="text-slate-300 hover:text-white transition">
            Services
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-white transition">
            About
          </Link>
          <Link href="/insights" className="text-slate-300 hover:text-white transition">
            Insights
          </Link>
          <Link href="/contact" className="text-slate-300 hover:text-white transition">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/properties"
            className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-md hover:bg-slate-800 hover:text-white transition flex items-center gap-1.5"
          >
            Explore Properties
          </Link>
          <Link
            href="/contact?type=brief"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition shadow-lg shadow-blue-900/30 flex items-center gap-1.5"
          >
            Start a Project <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium text-slate-200">
            <Link
              href="/properties"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              Properties <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              Projects Portfolio <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              Services <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              About SwiftStruct <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/insights"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              Insights <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 py-1 transition flex items-center justify-between"
            >
              Contact Us <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </nav>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              href="/properties"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 border border-slate-700 text-slate-200 rounded-md font-medium hover:bg-slate-800"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact?type=brief"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-500"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
