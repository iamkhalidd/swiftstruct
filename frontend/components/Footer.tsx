import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 flex items-center justify-center rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SWIFTSTRUCT
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            SwiftStruct Limited is an integrated real estate agency, consultancy, construction and project delivery company. We connect property opportunities with professional engineering execution.
          </p>
          <div className="pt-2 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SwiftStruct Limited. All rights reserved.
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services/real-estate-agency" className="hover:text-blue-400 transition">
                Real Estate Agency
              </Link>
            </li>
            <li>
              <Link href="/services/real-estate-consultancy" className="hover:text-blue-400 transition">
                Real Estate Consultancy
              </Link>
            </li>
            <li>
              <Link href="/services/building-construction" className="hover:text-blue-400 transition">
                Building & Construction
              </Link>
            </li>
            <li>
              <Link href="/services/project-management" className="hover:text-blue-400 transition">
                Project Management
              </Link>
            </li>
            <li>
              <Link href="/services/contracting" className="hover:text-blue-400 transition">
                General Contracting
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/properties" className="hover:text-blue-400 transition">
                Browse Properties
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-blue-400 transition">
                Project Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-400 transition">
                About SwiftStruct
              </Link>
            </li>
            <li>
              <Link href="/insights" className="hover:text-blue-400 transition">
                Industry Insights
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-400 transition">
                Contact & Brief
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-slate-400 hover:text-slate-200 transition text-xs">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Corporate Office</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>+234 800 SWIFTSTRUCT</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>info@swiftstruct.com</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
