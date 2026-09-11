import Link from 'next/link';
import { ArrowRightIcon, BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Project } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryImage =
    project.images?.find((img) => img.isPrimary)?.url ||
    project.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80';

  // Monochrome status treatment: darker chip = further along the lifecycle.
  const statusColors = {
    COMPLETED: 'bg-black text-white',
    ONGOING: 'bg-neutral-700 text-white',
    UPCOMING: 'bg-white text-neutral-900 border border-neutral-300',
    ARCHIVED: 'bg-neutral-400 text-white',
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-md ${statusColors[project.status] || 'bg-neutral-700 text-white'}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
            <BriefcaseIcon className="w-3.5 h-3.5" />
            <span>{project.projectType}</span>
          </div>

          <h3 className="font-bold text-neutral-900 text-xl leading-snug group-hover:text-neutral-600 transition mb-2">
            {project.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-4">
            <MapPinIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{project.location}</span>
          </div>

          <p className="text-neutral-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        <div>
          {/* Progress Bar if Ongoing */}
          {project.status === 'ONGOING' && (
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                <span>Progress</span>
                <span className="font-bold text-neutral-900">{project.progressPercent}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition"
          >
            Explore Project Details <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
