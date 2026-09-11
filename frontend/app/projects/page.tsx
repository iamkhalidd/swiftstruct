'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { api, Project } from '@/lib/api';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.projects.getAll(params);
      setProjects(res.data || []);
    } catch {
      setError('Could not load projects portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white py-14 border-b border-neutral-200">
        <div className="container-custom">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Project Delivery & Contracting
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Construction & Projects Portfolio
            </h1>
            <p className="text-neutral-600 text-sm">
              Explore our track record across turnkey residential developments, commercial high-rises, structural renovations, and civil engineering projects.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 flex-1">
        <div className="container-custom">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                statusFilter === ''
                  ? 'bg-black text-white shadow'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                statusFilter === 'COMPLETED'
                  ? 'bg-black text-white shadow'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('ONGOING')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                statusFilter === 'ONGOING'
                  ? 'bg-black text-white shadow'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Ongoing Construction
            </button>
            <button
              onClick={() => setStatusFilter('UPCOMING')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                statusFilter === 'UPCOMING'
                  ? 'bg-black text-white shadow'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent" />
              <p className="text-neutral-500 text-sm font-medium">Loading project portfolio...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-700 text-sm max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 max-w-lg mx-auto my-12 space-y-4">
              <WrenchScrewdriverIcon className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-xl font-bold text-neutral-900">No projects found</h3>
              <p className="text-neutral-500 text-sm">
                No projects found in this category.
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
