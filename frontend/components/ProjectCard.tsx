import Link from 'next/link';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryImage =
    project.images?.find((img) => img.isPrimary)?.url ||
    project.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80';

  const statusColors = {
    COMPLETED: 'bg-emerald-600 text-white',
    ONGOING: 'bg-blue-600 text-white',
    UPCOMING: 'bg-amber-500 text-white',
    ARCHIVED: 'bg-slate-500 text-white',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-md ${statusColors[project.status] || 'bg-slate-700 text-white'}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{project.projectType}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-xl leading-snug group-hover:text-blue-600 transition mb-2">
            {project.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{project.location}</span>
          </div>

          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        <div>
          {/* Progress Bar if Ongoing */}
          {project.status === 'ONGOING' && (
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Progress</span>
                <span className="font-bold text-blue-600">{project.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition"
          >
            Explore Project Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
