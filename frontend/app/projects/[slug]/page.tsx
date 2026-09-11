'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Project } from '@/lib/api';
import {
  MapPinIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await api.projects.getBySlug(slug);
        setProject(data);
      } catch {
        setError('Project details not found.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent" />
            <p className="text-neutral-500 text-sm font-medium">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 container-custom">
          <div className="bg-white p-10 rounded-2xl border border-neutral-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <WrenchScrewdriverIcon className="w-12 h-12 text-neutral-300 mx-auto" />
            <h2 className="text-2xl font-bold text-neutral-900">Project Not Found</h2>
            <p className="text-neutral-600 text-sm">{error || 'The requested project could not be found.'}</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-xs rounded-lg hover:bg-neutral-800 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Projects Portfolio
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage =
    project.images?.find((i) => i.isPrimary)?.url ||
    project.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80';

  const scopeList = project.scope ? project.scope.split(',').map((s) => s.trim()) : [];
  const servicesList = project.services ? project.services.split(',').map((s) => s.trim()) : [];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Breadcrumb Header */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="container-custom flex items-center justify-between text-xs text-neutral-500">
          <Link href="/projects" className="hover:text-neutral-900 flex items-center gap-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>
          <span className="font-mono text-neutral-500">Ref: {project.reference}</span>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="bg-white py-12">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase rounded-md">
                {project.status}
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {project.projectType}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 leading-tight">
              {project.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <MapPinIcon className="w-4 h-4 text-neutral-500" />
              <span>{project.location}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-100 border border-neutral-200 shadow-2xl">
              <img src={primaryImage} alt={project.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-14">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">Project Overview</h2>
              <p className="text-neutral-600 text-base leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Scope of Work */}
            {scopeList.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-neutral-900">Scope of Work</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {scopeList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-neutral-700 font-medium">
                      <CheckCircleIcon className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Provided */}
            {servicesList.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-neutral-900">Services Provided</h2>
                <div className="flex flex-wrap gap-2 pt-2">
                  {servicesList.map((srv, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-900 font-semibold text-xs rounded-lg">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info & Lead CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 text-lg border-b border-neutral-100 pb-3">
                Project Information
              </h3>

              <div className="space-y-3 text-sm text-neutral-600">
                <div>
                  <span className="block text-xs font-bold text-neutral-500 uppercase">Status</span>
                  <span className="font-bold text-neutral-900">{project.status}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-500 uppercase">Type</span>
                  <span className="font-bold text-neutral-900">{project.projectType}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-500 uppercase">Location</span>
                  <span className="font-bold text-neutral-900">{project.location}</span>
                </div>
                {project.status === 'ONGOING' && (
                  <div>
                    <span className="block text-xs font-bold text-neutral-500 uppercase">Progress</span>
                    <span className="font-bold text-neutral-900">{project.progressPercent}% Completed</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 text-neutral-900 p-8 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-xl font-bold">Have a Similar Project?</h3>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Contact SwiftStruct Limited to discuss engineering scope, feasibility, construction schedules, and budget estimations for your upcoming project.
              </p>
              <Link
                href={`/contact?type=brief&projectType=${encodeURIComponent(project.projectType)}`}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold rounded-lg transition text-center block text-xs"
              >
                Request a Similar Project Brief
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
