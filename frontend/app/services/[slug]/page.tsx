'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, ServiceItem } from '@/lib/api';
import {
  Building2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadService() {
      try {
        const data = await api.services.getBySlug(slug);
        setService(data);
      } catch {
        setError('Service details not found.');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            <p className="text-slate-500 text-sm font-medium">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 container-custom">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
            <p className="text-slate-600 text-sm">{error || 'The requested service page could not be located.'}</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const featuresList = service.features ? service.features.split(',').map((f) => f.trim()) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="container-custom">
          <div className="mb-4">
            <Link href="/services" className="text-xs text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All Services
            </Link>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {service.name}
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Content Body */}
      <section className="py-14 flex-1">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={service.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80'}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description Content */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Detailed Scope & Capabilities</h2>
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {service.content}
              </p>
            </div>

            {/* Key Capabilities */}
            {featuresList.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Key Execution Pillars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white p-8 rounded-2xl sticky top-28 space-y-6 shadow-xl border border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Consultation</span>
                <h3 className="text-2xl font-bold">Engage Our Team</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Request a structured consultation or project brief regarding <span className="font-semibold text-white">{service.name}</span>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={`/contact?type=brief&service=${encodeURIComponent(service.name)}`}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-center block text-xs shadow-md shadow-blue-900/30"
                >
                  Start a Project Brief
                </Link>
                <Link
                  href="/contact"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition text-center block text-xs border border-slate-700"
                >
                  General Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
