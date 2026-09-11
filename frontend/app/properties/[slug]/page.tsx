'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Property } from '@/lib/api';
import {
  Bed,
  Bath,
  Car,
  MapPin,
  Tag,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  Building2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await api.properties.getBySlug(slug);
        setProperty(data);
      } catch {
        setError('Property not found or unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [slug]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.enquiries.create({
        type: 'PROPERTY',
        name: fullName,
        email,
        phone,
        subject: `Enquiry for ${property.title} (${property.reference})`,
        message,
        propertyId: property.id,
      });
      setSubmitSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            <p className="text-slate-500 text-sm font-medium">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 container-custom">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
            <p className="text-slate-600 text-sm">{error || 'The requested property could not be located.'}</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Properties Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage =
    property.images?.find((i) => i.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: property.currency || 'NGN',
    maximumFractionDigits: 0,
  }).format(property.price);

  const amenitiesList = property.amenities
    ? property.amenities.split(',').map((a) => a.trim())
    : [];

  const featuresList = property.features
    ? property.features.split(',').map((f) => f.trim())
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Breadcrumb Header */}
      <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="container-custom flex items-center justify-between text-xs text-slate-400">
          <Link href="/properties" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <span className="font-mono text-slate-500">Ref: {property.reference}</span>
        </div>
      </section>

      {/* Property Hero Gallery */}
      <section className="bg-slate-900 text-white pb-12 pt-4">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-800 shadow-2xl relative">
              <img
                src={primaryImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-3 py-1 text-xs font-extrabold uppercase rounded-md text-white shadow-md ${
                    property.listingType === 'SALE' ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}
                >
                  For {property.listingType}
                </span>
                <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-md text-slate-900 bg-white shadow-md">
                  {property.propertyType}
                </span>
              </div>
            </div>

            {/* Thumbnail Row if multiple images */}
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {property.images.map((img) => (
                  <div key={img.id} className="rounded-lg overflow-hidden aspect-video border border-slate-800 bg-slate-950">
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{property.location}, {property.city}, {property.state}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {property.title}
              </h1>

              <div className="pt-2">
                <span className="block text-xs uppercase text-slate-400 font-bold tracking-wider">Asking Price</span>
                <span className="text-3xl font-black text-white">{formattedPrice}</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-800 text-slate-300 text-xs text-center">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <Bed className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="font-bold block">{property.bedrooms}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Beds</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <Bath className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="font-bold block">{property.bathrooms}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Baths</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <Car className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="font-bold block">{property.parkingSpaces}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Parking</span>
                </div>
              </div>
            </div>

            <a
              href="#enquiry-form"
              className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-center transition block text-sm shadow-lg shadow-blue-900/30"
            >
              Enquire About This Property
            </a>
          </div>
        </div>
      </section>

      {/* Property Information & Enquiry Form */}
      <section className="py-14">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-10">
            {/* Description */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Property Overview</h2>
              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Amenities & Infrastructure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {amenitiesList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {featuresList.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Property Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {featuresList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enquiry Form Side Card */}
          <div className="lg:col-span-5" id="enquiry-form">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Property Enquiry</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Speak With Our Agent</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Enquiry Reference: <span className="font-bold text-slate-800">{property.reference}</span>
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-lg">Enquiry Received</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Thank you! Your enquiry for <span className="font-semibold">{property.title}</span> has been routed to our real estate team. We will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Oluwaseun Adebayo"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 800 000 0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message / Request *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I am interested in inspecting this property..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Property Enquiry'} <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
