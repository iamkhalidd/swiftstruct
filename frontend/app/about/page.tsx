import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Building2,
  HardHat,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="container-custom">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Company Profile
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              About SwiftStruct Limited
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              SwiftStruct Limited is an integrated real estate and construction project delivery company providing agency, advisory, turnkey building construction, project management, and general contracting.
            </p>
          </div>
        </div>
      </section>

      {/* Positioning Section */}
      <section className="py-16 bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Our Core Proposition</span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Connecting Property Opportunities with Professional Engineering Delivery
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Too often in real estate and construction, a gap exists between property acquisition and technical construction execution. Real estate brokers lack construction engineering depth, while isolated contractors fail to appreciate property market dynamics and investment return targets.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              SwiftStruct Limited bridges this gap completely. We provide clients with seamless transition from initial property sourcing, land due diligence, and feasibility advisory directly into structural design, construction management, and turnkey delivery.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-2xl space-y-6 shadow-xl border border-slate-800">
            <h3 className="text-2xl font-bold">Integrated Core Values</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Integrated Expertise</h4>
                  <p className="text-slate-400 text-xs">Real estate agency, advisory, and construction under one management umbrella.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Project-Focused Delivery</h4>
                  <p className="text-slate-400 text-xs">Structured milestone planning, cost tracking, and quality supervision.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Professional Accountability</h4>
                  <p className="text-slate-400 text-xs">Adherence to structural engineering standards, regulatory codes, and transparent timelines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SwiftStruct */}
      <section className="py-16 bg-slate-100">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Why SwiftStruct</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Professional Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-lg text-slate-900">Real Estate Agency</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Property sales, rentals, property sourcing, and strategic asset marketing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-lg text-slate-900">Development Advisory</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Investment feasibility studies, market research, and acquisition due diligence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-lg text-slate-900">Building Construction</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Turnkey residential and commercial construction, remodeling, and structural works.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-bold text-lg text-slate-900">Project Management</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Timeline scheduling, cost coordination, contractor oversight, and site supervision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-2xl space-y-6">
          <h2 className="text-3xl font-extrabold">Work With SwiftStruct Limited</h2>
          <p className="text-slate-300 text-sm">
            Whether you are looking to acquire property or execute a complex construction brief, our team is ready to deliver.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/contact?type=brief"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-lg transition"
            >
              Start a Project Brief
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-lg transition border border-slate-700"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
