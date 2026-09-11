'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  HardHat,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'brief' ? 'PROJECT_BRIEF' : 'GENERAL';
  const initialService = searchParams.get('service') || '';

  const [activeTab, setActiveType] = useState<'GENERAL' | 'PROJECT_BRIEF'>(initialType);

  // General Contact Form
  const [genName, setGenName] = useState('');
  const [genEmail, setGenEmail] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genSubject, setGenSubject] = useState('');
  const [genMessage, setGenMessage] = useState('');

  // Project Brief Form
  const [briefNeed, setBriefNeed] = useState(initialService || 'Building & Construction');
  const [briefName, setBriefName] = useState('');
  const [briefEmail, setBriefEmail] = useState('');
  const [briefPhone, setBriefPhone] = useState('');
  const [briefLocation, setBriefLocation] = useState('');
  const [briefProjectType, setBriefProjectType] = useState('Residential Construction');
  const [briefBudget, setBriefBudget] = useState('');
  const [briefDescription, setBriefDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.enquiries.create({
        type: 'GENERAL',
        name: genName,
        email: genEmail,
        phone: genPhone,
        subject: genSubject || 'General Contact Enquiry',
        message: genMessage,
      });
      setSubmitSuccess(true);
      setGenName('');
      setGenEmail('');
      setGenPhone('');
      setGenSubject('');
      setGenMessage('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit contact enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.enquiries.create({
        type: 'PROJECT_BRIEF',
        name: briefName,
        email: briefEmail,
        phone: briefPhone,
        subject: `Project Brief: ${briefNeed} (${briefProjectType})`,
        serviceRequested: briefNeed,
        location: briefLocation,
        projectType: briefProjectType,
        budget: briefBudget,
        message: briefDescription,
      });
      setSubmitSuccess(true);
      setBriefName('');
      setBriefEmail('');
      setBriefPhone('');
      setBriefLocation('');
      setBriefBudget('');
      setBriefDescription('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit project brief.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-14 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6 shadow-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Headquarters</span>
              <h2 className="text-2xl font-bold mt-1">SwiftStruct Limited</h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Connect with our property consultancy and engineering project management teams.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs uppercase">Office Location</span>
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs uppercase">Phone Contact</span>
                  <span>+234 800 SWIFTSTRUCT</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs uppercase">Email Enquiry</span>
                  <span>info@swiftstruct.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Integrated Scope</h3>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Property Acquisition & Sales</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Turnkey Building & Construction</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Professional Project Management</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Development Advisory & Feasibility</p>
            </div>
          </div>
        </div>

        {/* Interactive Form Switcher */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setActiveType('PROJECT_BRIEF'); setSubmitSuccess(false); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                  activeTab === 'PROJECT_BRIEF'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Start a Project Brief
              </button>
              <button
                type="button"
                onClick={() => { setActiveType('GENERAL'); setSubmitSuccess(false); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                  activeTab === 'GENERAL'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                General Inquiry
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-xl">Submission Received</h3>
                <p className="text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
                  Thank you! Your submission has been logged into SwiftStruct Limited’s project management system. Our team will review your brief and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-500 transition"
                >
                  Submit Another Brief
                </button>
              </div>
            ) : activeTab === 'PROJECT_BRIEF' ? (
              /* Project Brief Form */
              <form onSubmit={handleBriefSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Start a Project Brief</h3>
                  <p className="text-xs text-slate-500">Provide details about your construction, renovation, or consultancy project.</p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What service do you require? *</label>
                  <select
                    value={briefNeed}
                    onChange={(e) => setBriefNeed(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    <option value="Building & Construction">Build a Property / Structural Construction</option>
                    <option value="Renovation & Remodeling">Renovate / Remodel Existing Structure</option>
                    <option value="Project Management">Project Management & Supervision</option>
                    <option value="General Contracting">General Contracting & Procurement</option>
                    <option value="Real Estate Consultancy">Real Estate Investment & Development Consultancy</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={briefName}
                      onChange={(e) => setBriefName(e.target.value)}
                      placeholder="e.g. Dr. Chidi Nnamdi"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={briefEmail}
                      onChange={(e) => setBriefEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={briefPhone}
                      onChange={(e) => setBriefPhone(e.target.value)}
                      placeholder="e.g. +234 800 000 0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Location *</label>
                    <input
                      type="text"
                      required
                      value={briefLocation}
                      onChange={(e) => setBriefLocation(e.target.value)}
                      placeholder="e.g. Victoria Island, Lagos"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Category *</label>
                    <select
                      value={briefProjectType}
                      onChange={(e) => setBriefProjectType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    >
                      <option value="Residential Construction">Residential Development</option>
                      <option value="Commercial Construction">Commercial Building / Plaza</option>
                      <option value="Industrial / Warehouse">Industrial Facility</option>
                      <option value="Infrastructure / Civil">Civil Works / Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget</label>
                    <input
                      type="text"
                      value={briefBudget}
                      onChange={(e) => setBriefBudget(e.target.value)}
                      placeholder="e.g. ₦100m - ₦250m"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Scope *</label>
                  <textarea
                    required
                    rows={4}
                    value={briefDescription}
                    onChange={(e) => setBriefDescription(e.target.value)}
                    placeholder="Describe your site details, required timeline, and specific engineering scope..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-50"
                >
                  {submitting ? 'Submitting Brief...' : 'Submit Project Brief'} <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* General Contact Form */
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">General Contact Inquiry</h3>
                  <p className="text-xs text-slate-500">Send us a message and our team will get back to you.</p>
                </div>

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
                    value={genName}
                    onChange={(e) => setGenName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={genEmail}
                      onChange={(e) => setGenEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={genPhone}
                      onChange={(e) => setGenPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={genMessage}
                    onChange={(e) => setGenMessage(e.target.value)}
                    placeholder="Your message details..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="container-custom">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Contact & Project Inquiry
            </h1>
            <p className="text-slate-300 text-sm">
              Submit a structured project brief or reach out directly to our real estate and construction team.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center">Loading contact form...</div>}>
        <ContactFormContent />
      </Suspense>

      <Footer />
    </div>
  );
}
