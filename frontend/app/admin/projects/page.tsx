'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import ImageGalleryUpload, { GalleryImage } from '@/components/ImageGalleryUpload';
import {
  ClockIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ImageUpload from '@/components/ImageUpload';

const PROJECT_STATUSES = ['UPCOMING', 'ONGOING', 'COMPLETED', 'ARCHIVED'];

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

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
  const [editingId, setEditingId] = useState<string | null>(null);

  // Progress-updates panel
  const [updatesProject, setUpdatesProject] = useState<any | null>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateImage, setUpdateImage] = useState('');
  const [updatePublicId, setUpdatePublicId] = useState('');
  const [updateProgress, setUpdateProgress] = useState('');

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

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImages([]);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (proj: any) => {
    setEditingId(proj.id);
    setName(proj.name ?? '');
    setDescription(proj.description ?? '');
    setLocation(proj.location ?? '');
    setProjectType(proj.projectType ?? '');
    setStatus(proj.status ?? 'ONGOING');
    setProgressPercent(String(proj.progressPercent ?? 0));
    setScope(proj.scope ?? '');
    setServices(proj.services ?? '');
    setImages(
      (proj.images ?? []).map((img: any, i: number) => ({
        url: img.url,
        publicId: img.publicId,
        caption: img.caption,
        isPrimary: img.isPrimary ?? i === 0,
      })),
    );
    setShowModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      description,
      location,
      projectType,
      status,
      progressPercent: Math.max(0, Math.min(100, parseInt(progressPercent) || 0)),
      scope,
      services,
      images,
    };

    try {
      if (editingId) {
        await adminApi.projects.update(editingId, payload);
      } else {
        await adminApi.projects.create(payload);
      }
      setShowModal(false);
      resetForm();
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  /** Inline progress edit from the table, committed when the field loses focus. */
  const handleUpdateProgress = async (id: string, value: string) => {
    const next = Math.max(0, Math.min(100, parseInt(value) || 0));
    setSavingId(id);
    try {
      await adminApi.projects.update(id, { progressPercent: next });
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    } finally {
      await loadProjects();
      setSavingId(null);
    }
  };

  const openUpdates = async (project: any) => {
    setUpdatesProject(project);
    setLoadingUpdates(true);
    try {
      const list = await adminApi.projects.getUpdates(project.id);
      setUpdates(Array.isArray(list) ? list : []);
    } catch {
      setUpdates([]);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatesProject) return;
    setAddingUpdate(true);

    const parsed = updateProgress.trim() === '' ? undefined : parseInt(updateProgress);
    const progress =
      parsed === undefined || Number.isNaN(parsed)
        ? undefined
        : Math.max(0, Math.min(100, parsed));

    try {
      await adminApi.projects.addUpdate(updatesProject.id, {
        title: updateTitle,
        description: updateDescription || undefined,
        imageUrl: updateImage || undefined,
        publicId: updatePublicId || undefined,
        progressPercent: progress,
      });

      setUpdateTitle('');
      setUpdateDescription('');
      setUpdateImage('');
      setUpdatePublicId('');
      setUpdateProgress('');

      const list = await adminApi.projects.getUpdates(updatesProject.id);
      setUpdates(Array.isArray(list) ? list : []);

      // Posting a progress figure rolls it onto the project, so refresh both
      // the table behind the modal and the modal's own header.
      if (progress !== undefined) {
        setUpdatesProject((prev: any) =>
          prev ? { ...prev, progressPercent: progress } : prev,
        );
      }
      await loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to post update');
    } finally {
      setAddingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!updatesProject) return;
    if (!confirm('Delete this progress update?')) return;
    try {
      await adminApi.projects.deleteUpdate(updatesProject.id, updateId);
      setUpdates((prev) => prev.filter((u) => u.id !== updateId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete update');
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
          <h1 className="text-2xl font-black text-neutral-900">Projects Portfolio Management</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Manage turnkey construction projects, project statuses, and scope details
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-black/10"
        >
          <PlusIcon className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            Loading projects portfolio...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            No projects in database. Click &quot;Add New Project&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Project Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-900 max-w-xs truncate">
                      {proj.name}
                    </td>
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
                            ? 'bg-neutral-900'
                            : proj.status === 'ONGOING'
                              ? 'bg-neutral-600'
                              : 'bg-neutral-400'
                        }`}
                      >
                        {PROJECT_STATUSES.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-white text-neutral-900"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={proj.progressPercent ?? 0}
                          disabled={savingId === proj.id}
                          onBlur={(e) => handleUpdateProgress(proj.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          title="Adjust progress, then click away or press Enter"
                          className="w-16 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-xs font-bold text-neutral-900 disabled:opacity-50"
                        />
                        <span className="font-bold text-neutral-900">%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openUpdates(proj)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 transition"
                        title="Progress Updates"
                      >
                        <ClockIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(proj)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 transition"
                        title="Edit Project"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-neutral-500 hover:text-red-600 transition"
                        title="Delete Project"
                      >
                        <TrashIcon className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingId ? 'Edit Project' : 'Add New Construction / Delivery Project'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Commercial Tower"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category / Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g. Building & Construction, Commercial"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Progress Percentage (0-100%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <ImageGalleryUpload label="Project Images" images={images} onChange={setImages} />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Scope of Work
                </label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="Comma-separated scope items"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full project description..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-neutral-200 text-neutral-600 font-bold text-xs rounded-lg hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {submitting
                    ? 'Saving Project...'
                    : editingId
                      ? 'Save Changes'
                      : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Project Progress Updates */}
      {updatesProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Progress Updates</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {updatesProject.name} — currently {updatesProject.progressPercent ?? 0}% complete
                </p>
              </div>
              <button
                onClick={() => setUpdatesProject(null)}
                className="text-neutral-500 hover:text-neutral-900"
                title="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleAddUpdate}
              className="space-y-4 bg-neutral-50 border border-neutral-200 rounded-xl p-5"
            >
              <h3 className="text-sm font-bold text-neutral-900">Post a new update</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="e.g. Roof slab poured"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Overall progress at this update
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={updateProgress}
                    onChange={(e) => setUpdateProgress(e.target.value)}
                    placeholder="Optional, e.g. 70"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Setting this also updates the project percentage.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Site Notes
                </label>
                <textarea
                  rows={2}
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  placeholder="What changed on site since the last update?"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <ImageUpload
                label="Progress Photo"
                value={updateImage}
                onChange={(url, publicId) => {
                  setUpdateImage(url);
                  setUpdatePublicId(publicId ?? '');
                }}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingUpdate}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {addingUpdate ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Timeline</h3>
              {loadingUpdates ? (
                <p className="text-xs text-neutral-500">Loading updates...</p>
              ) : updates.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  No updates posted yet. Clients will see this timeline on the public project page.
                </p>
              ) : (
                <ul className="space-y-3">
                  {updates.map((u) => (
                    <li
                      key={u.id}
                      className="flex gap-4 border border-neutral-200 rounded-xl p-4"
                    >
                      {u.imageUrl && (
                        <img
                          src={u.imageUrl}
                          alt={u.title}
                          className="w-24 h-24 object-cover rounded-lg shrink-0 border border-neutral-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-sm text-neutral-900">{u.title}</h4>
                          <button
                            onClick={() => handleDeleteUpdate(u.id)}
                            className="p-1 text-neutral-400 hover:text-red-600 shrink-0"
                            title="Delete update"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {formatDate(u.createdAt)}
                          {u.progressPercent != null && (
                            <span className="font-bold text-neutral-700">
                              · {u.progressPercent}%
                            </span>
                          )}
                        </p>
                        {u.description && (
                          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                            {u.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
