import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import ProjectCard from '@/components/ProjectCard';
import { api, Property, Project, InsightArticle } from '@/lib/api';
import {
  Building2,
  HardHat,
  ClipboardList,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Award,
} from 'lucide-react';

export const revalidate = 60; // ISR revalidation every 60s

export default async function HomePage() {
  let featuredProperties: Property[] = [];
  let featuredProjects: Project[] = [];
  let latestInsights: InsightArticle[] = [];

  try {
    const propertiesRes = await api.properties.getAll({ limit: 3 });
    featuredProperties = propertiesRes.data || [];
  } catch {
    // Graceful fallback
  }

  try {
    const projectsRes = await api.projects.getAll({ limit: 3 });
    featuredProjects = projectsRes.data || [];
  } catch {
    // Graceful fallback
  }

  try {
    latestInsights = await api.insights.getAll();
  } catch {
    // Graceful fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold tracking-wider uppercase">
              <Building2 className="w-4 h-4 text-blue-400" />
              Integrated Real Estate & Construction Delivery
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Property. Construction. <span className="text-blue-500">Delivered.</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              From finding the right property to building and managing your next project, SwiftStruct provides integrated real estate and construction solutions under one professional umbrella.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/properties"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-xl shadow-blue-900/40 text-center flex items-center justify-center gap-2"
              >
                Explore Properties <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact?type=brief"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold border border-slate-700 rounded-lg transition text-center"
              >
                Start a Project
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural Excellence"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Project Showcase</span>
                <h3 className="text-xl font-bold text-white">The Crestwood Luxury Residences</h3>
                <p className="text-slate-300 text-xs">Turnkey residential construction & development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Core Business Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Complete Property & Project Services
            </h2>
            <p className="text-slate-600 text-base">
              SwiftStruct connects property acquisition opportunities with professional construction execution and management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Find a Property */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Find a Property</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Buy, rent, sell or invest in prime residential, commercial and industrial real estate across Nigeria.
                </p>
              </div>
              <Link
                href="/properties"
                className="text-sm font-bold text-blue-600 flex items-center gap-1.5 hover:text-blue-800 transition"
              >
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Build a Project */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition">
                  <HardHat className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Build a Project</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Turnkey structural building, commercial construction, structural renovations, and general contracting.
                </p>
              </div>
              <Link
                href="/services/building-construction"
                className="text-sm font-bold text-amber-600 flex items-center gap-1.5 hover:text-amber-800 transition"
              >
                Construction Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Manage a Project */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Manage a Project</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Rigorous planning, budget control, contractor supervision, and quality assurance from concept to handover.
                </p>
              </div>
              <Link
                href="/services/project-management"
                className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 hover:text-emerald-800 transition"
              >
                Project Delivery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Real Estate Consultancy */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Real Estate Consultancy</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Data-backed investment advisory, land assembly, feasibility studies, and acquisition due diligence.
                </p>
              </div>
              <Link
                href="/services/real-estate-consultancy"
                className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 transition"
              >
                Advisory Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-slate-100">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Property Showcase</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Featured Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 transition"
              >
                View All Properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Integrated Expertise Banner */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Why Choose SwiftStruct</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Integrated Expertise Under One Roof
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Unlike traditional agency-only brokers or isolated construction contractors, SwiftStruct Limited brings property sourcing, engineering feasibility, construction, and project management together.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Integrated Real Estate & Engineering</h4>
                  <p className="text-slate-400 text-sm">Eliminates communication breakdown between real estate agents and construction builders.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Structured Cost & Schedule Control</h4>
                  <p className="text-slate-400 text-sm">Professional milestone reporting and budget discipline preventing project overruns.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Quality Assurance & Accountability</h4>
                  <p className="text-slate-400 text-sm">Strict adherence to structural specifications and regulatory compliance standards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1000&q=80"
              alt="Project Execution"
              className="rounded-2xl shadow-2xl border border-slate-800 object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Portfolio */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Track Record</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Projects Portfolio
                </h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 transition"
              >
                View Full Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Insights Teaser */}
      {latestInsights.length > 0 && (
        <section className="py-20 bg-slate-100">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Thought Leadership</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Latest Insights
                </h2>
              </div>
              <Link href="/insights" className="font-bold text-blue-600 hover:text-blue-800 transition">
                Read All Articles &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestInsights.slice(0, 2).map((article) => (
                <div key={article.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row">
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full md:w-48 h-48 object-cover shrink-0"
                    />
                  )}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{article.category}</span>
                      <h3 className="font-bold text-lg text-slate-900 mt-1 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/insights/${article.slug}`}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 transition mt-4"
                    >
                      Read Full Article &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container-custom text-center max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to Find Property or Start Your Construction Project?
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Speak directly with SwiftStruct's real estate agency and engineering project management teams today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/contact?type=brief"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition shadow-xl"
            >
              Submit Project Brief
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition border border-blue-500"
            >
              Contact SwiftStruct
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
