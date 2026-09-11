'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import ImageGalleryUpload, { GalleryImage } from '@/components/ImageGalleryUpload';
import { HardHat, Plus, Trash2, X } from 'lucide-react';

const PROJECT_STATUSES = ['UPCOMING', 'ONGOING', 'COMPLETED', 'ARCHIVED'];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Victoria Island, Lagos');
  const [projectType, setProjectType] = useState('Building & Construction');
  const [status, setStatus] = useState('ONGOING');
  const [progressPercent, setProgressPercent] = useState('50');
  const [scope, setScope] = useState('Full Civil Works, MEP Systems, Architectural Finishing');
  const [services, setServices] = useState('Building & Construction, Project Management');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await adminApi.projects.getAll();
      setProjects(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.projects.create({
        name,
        description,
        location,
        projectType,
        status,
        progressPercent: parseInt(progressPercent) || 0,
        scope,
        services,
        images,
      });
      setShowModal(false);
      setName('');
      setDescription('');
      setImages([]);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setSavingId(id);
    try {
      await adminApi.projects.update(id, { status });
      await loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to update project status');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await adminApi.projects.delete(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Projects Portfolio Management</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage turnkey construction projects, project statuses, and scope details</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">Loading projects portfolio...</div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No projects in database. Click "Add New Project" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Project Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{proj.name}</td>
                    <td className="p-4">{proj.projectType}</td>
                    <td className="p-4">{proj.location}</td>
                    <td className="p-4">
                      <select
                        value={proj.status}
                        onChange={(e) => handleUpdateStatus(proj.id, e.target.value)}
                        disabled={savingId === proj.id}
                        title="Update project status"
                        className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded text-white border-0 cursor-pointer disabled:opacity-50 ${
                          proj.status === 'COMPLETED'
                            ? 'bg-emerald-600'
                            : proj.status === 'ONGOING'
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                      >
                        {PROJECT_STATUSES.map((option) => (
                          <option key={option} value={option} className="bg-white text-slate-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 font-bold text-blue-600">{proj.progressPercent}%</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Construction / Delivery Project</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Commercial Tower"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category / Type *</label>
                  <input
                    type="text"
                    required
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g. Building & Construction, Commercial"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Progress Percentage (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <ImageGalleryUpload
                  label="Project Images"
                  images={images}
                  onChange={setImages}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scope of Work</label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="Comma-separated scope items"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full project description..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {submitting ? 'Saving Project...' : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
