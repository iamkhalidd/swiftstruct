import Link from 'next/link';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { SOCIAL_LINKS, SwiftStructMark } from '@/components/icons/BrandIcons';

const SERVICE_LINKS = [
  { href: '/services/real-estate-agency', label: 'Real Estate Agency' },
  { href: '/services/real-estate-consultancy', label: 'Real Estate Consultancy' },
  { href: '/services/building-construction', label: 'Building & Construction' },
  { href: '/services/project-management', label: 'Project Management' },
  { href: '/services/contracting', label: 'General Contracting' },
] as const;

const NAVIGATION_LINKS = [
  { href: '/properties', label: 'Browse Properties' },
  { href: '/projects', label: 'Project Portfolio' },
  { href: '/about', label: 'About SwiftStruct' },
  { href: '/insights', label: 'Industry Insights' },
  { href: '/contact', label: 'Contact & Brief' },
] as const;

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-600 border-t border-neutral-200">
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center rounded-lg">
              <SwiftStructMark className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-neutral-900">
              SWIFTSTRUCT
            </span>
          </Link>
          <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
            SwiftStruct Limited is an integrated real estate agency, consultancy, construction and project delivery company. We connect property opportunities with professional engineering execution.
          </p>

          {/* Real brand marks (Simple Icons paths), not generic UI glyphs */}
          <ul className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-black hover:text-white hover:border-black"
                >
                  <Icon className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-2 text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} SwiftStruct Limited. All rights reserved.
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-3">
          <h4 className="text-neutral-900 font-semibold text-sm tracking-wider uppercase">Our Services</h4>
          <ul className="space-y-2 text-sm">
            {SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-neutral-900 transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-neutral-900 font-semibold text-sm tracking-wider uppercase">Navigation</h4>
          <ul className="space-y-2 text-sm">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-neutral-900 transition">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/login" className="text-neutral-500 hover:text-neutral-900 transition text-xs">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="text-neutral-900 font-semibold text-sm tracking-wider uppercase">Corporate Office</h4>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>+234 800 SWIFTSTRUCT</span>
            </li>
            <li className="flex items-center gap-2.5">
              <EnvelopeIcon className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>info@swiftstruct.com</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
