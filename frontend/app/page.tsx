import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import ProjectCard from '@/components/ProjectCard';
import { AnimatedMarqueeHero } from '@/components/HeroMarquee';
import { api, Property, Project, InsightArticle } from '@/lib/api';
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export const revalidate = 60; // ISR revalidation every 60s

// Used only when there are too few published listings/projects to fill the
// hero marquee. Replaced by real CMS imagery as soon as content exists.
const FALLBACK_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
];

// Wide architectural backdrop for the hero. Deliberately a different photograph
// from the marquee set so the same image never appears twice on one screen.
const HERO_BACKGROUND =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80';

export default async function HomePage() {
  let featuredProperties: Property[] = [];
  let featuredProjects: Project[] = [];
  let latestInsights: InsightArticle[] = [];

  // These sections are driven by the `isFeatured` flag the admin sets. If
  // nothing is flagged yet, fall back to the newest records so the section is
  // never empty on a fresh install.
  try {
    const featuredRes = await api.properties.getAll({ limit: 3, isFeatured: true });
    featuredProperties = featuredRes.data || [];
    if (featuredProperties.length === 0) {
      const latestRes = await api.properties.getAll({ limit: 3 });
      featuredProperties = latestRes.data || [];
    }
  } catch {
    // Graceful fallback
  }

  try {
    const featuredRes = await api.projects.getAll({ limit: 3, isFeatured: true });
    featuredProjects = featuredRes.data || [];
    if (featuredProjects.length === 0) {
      const latestRes = await api.projects.getAll({ limit: 3 });
      featuredProjects = latestRes.data || [];
    }
  } catch {
    // Graceful fallback
  }

  try {
    latestInsights = await api.insights.getAll();
  } catch {
    // Graceful fallback
  }

  // Real listing/project photography feeds the hero marquee. Fewer than three
  // images makes the loop look repetitive, so fall back to stock shots.
  const showcaseImages = [
    ...featuredProperties.map(
      (property) =>
        property.images.find((image) => image.isPrimary)?.url ?? property.images[0]?.url,
    ),
    ...featuredProjects.map(
      (project) => project.images.find((image) => image.isPrimary)?.url ?? project.images[0]?.url,
    ),
  ].filter((url): url is string => Boolean(url));

  const marqueeImages = showcaseImages.length >= 3 ? showcaseImages : FALLBACK_HERO_IMAGES;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Hero Section */}
      <AnimatedMarqueeHero
        title={
          <>
            Property. Construction. <span className="text-neutral-500">Delivered.</span>
          </>
        }
        description="From finding the right property to building and managing your next project, SwiftStruct provides integrated real estate and construction solutions under one professional umbrella."
        ctaText="Explore Properties"
        ctaHref="/properties"
        secondaryCtaText="Start a Project"
        secondaryCtaHref="/contact?type=brief"
        images={marqueeImages}
        backgroundImage={HERO_BACKGROUND}
      />

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Core Business Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Complete Property & Project Services
            </h2>
            <p className="text-neutral-600 text-base">
              SwiftStruct connects property acquisition opportunities with professional construction execution and management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Find a Property */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition">
                  <BuildingOffice2Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">Find a Property</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Buy, rent, sell or invest in prime residential, commercial and industrial real estate across Nigeria.
                </p>
              </div>
              <Link
                href="/properties"
                className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 hover:text-neutral-600 transition"
              >
                Browse Catalog <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Build a Project */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition">
                  <WrenchScrewdriverIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">Build a Project</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Turnkey structural building, commercial construction, structural renovations, and general contracting.
                </p>
              </div>
              <Link
                href="/services/building-construction"
                className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 hover:text-neutral-600 transition"
              >
                Construction Services <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Manage a Project */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition">
                  <ClipboardDocumentListIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">Manage a Project</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Rigorous planning, budget control, contractor supervision, and quality assurance from concept to handover.
                </p>
              </div>
              <Link
                href="/services/project-management"
                className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 hover:text-neutral-600 transition"
              >
                Project Delivery <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Real Estate Consultancy */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition">
                  <ChartBarIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">Real Estate Consultancy</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Data-backed investment advisory, land assembly, feasibility studies, and acquisition due diligence.
                </p>
              </div>
              <Link
                href="/services/real-estate-consultancy"
                className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 hover:text-neutral-600 transition"
              >
                Advisory Services <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Property Showcase</span>
                <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
                  Featured Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 font-bold text-neutral-900 hover:text-neutral-600 transition"
              >
                View All Properties <ArrowRightIcon className="w-4 h-4" />
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
      <section className="py-20 bg-white border-y border-neutral-200">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Why Choose SwiftStruct</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-neutral-900">
              Integrated Expertise Under One Roof
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Unlike traditional agency-only brokers or isolated construction contractors, SwiftStruct Limited brings property sourcing, engineering feasibility, construction, and project management together.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">Integrated Real Estate & Engineering</h4>
                  <p className="text-neutral-600 text-sm">Eliminates communication breakdown between real estate agents and construction builders.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">Structured Cost & Schedule Control</h4>
                  <p className="text-neutral-600 text-sm">Professional milestone reporting and budget discipline preventing project overruns.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">Quality Assurance & Accountability</h4>
                  <p className="text-neutral-600 text-sm">Strict adherence to structural specifications and regulatory compliance standards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
              alt="Project Execution"
              className="rounded-2xl shadow-xl border border-neutral-200 object-cover w-full h-[400px]"
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
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Track Record</span>
                <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
                  Projects Portfolio
                </h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-bold text-neutral-900 hover:text-neutral-600 transition"
              >
                View Full Portfolio <ArrowRightIcon className="w-4 h-4" />
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
        <section className="py-20 bg-neutral-50">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Thought Leadership</span>
                <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
                  Latest Insights
                </h2>
              </div>
              <Link href="/insights" className="font-bold text-neutral-900 hover:text-neutral-600 transition">
                Read All Articles &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestInsights.slice(0, 2).map((article) => (
                <div key={article.id} className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col md:flex-row">
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full md:w-48 h-48 object-cover shrink-0"
                    />
                  )}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{article.category}</span>
                      <h3 className="font-bold text-lg text-neutral-900 mt-1 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-neutral-600 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/insights/${article.slug}`}
                      className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition mt-4"
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
      <section className="py-20 bg-black text-white">
        <div className="container-custom text-center max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to Find Property or Start Your Construction Project?
          </h2>
          <p className="text-neutral-300 text-lg leading-relaxed">
            Speak directly with SwiftStruct&apos;s real estate agency and engineering project management teams today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/contact?type=brief"
              className="px-8 py-4 bg-white hover:bg-neutral-200 text-neutral-900 font-bold rounded-lg transition shadow-xl"
            >
              Submit Project Brief
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition border border-neutral-600"
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
