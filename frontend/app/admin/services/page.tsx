'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import ImageUpload from '@/components/ImageUpload';
import { ServiceItem } from '@/lib/api';
import { CheckCircleIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [features, setFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await adminApi.services.getAll();
      setServices(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openEditor = (srv: ServiceItem) => {
    setEditing(srv);
    setName(srv.name || '');
    setShortDescription(srv.shortDescription || '');
    setContent(srv.content || '');
    setFeatures(srv.features || '');
    setImageUrl(srv.imageUrl || '');
    setIsPublished(srv.isPublished ?? true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await adminApi.services.update(editing.id, {
        name,
        shortDescription,
        content,
        features,
        imageUrl,
        isPublished,
      });
      setEditing(null);
      await loadServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900">Services Content Management</h1>
        <p className="text-neutral-500 text-xs mt-0.5">
          Core business service pillars active on SwiftStruct Limited platform
        </p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          Loading services…
        </div>
      ) : services.length === 0 ? (
        <div className="p-10 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          No services available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 font-extrabold text-[10px] uppercase rounded ${
                    srv.isPublished === false
                      ? 'bg-neutral-100 text-neutral-600'
                      : 'bg-neutral-900 text-white'
                  }`}
                >
                  {srv.isPublished === false ? 'Draft' : 'Active Pillar'}
                </span>
                <span className="text-xs font-mono text-neutral-500">/{srv.slug}</span>
              </div>

              <h3 className="font-bold text-neutral-900 text-lg">{srv.name}</h3>
              <p className="text-neutral-600 text-xs leading-relaxed">{srv.shortDescription}</p>

              {srv.features && (
                <div className="pt-2 border-t border-neutral-100 space-y-1">
                  {srv.features.split(',').slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                      <CheckCircleIcon className="w-3 h-3 text-neutral-900" />
                      <span>{f.trim()}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => openEditor(srv)}
                className="mt-auto pt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-neutral-600 border-t border-neutral-100 transition"
              >
                <PencilIcon className="w-3.5 h-3.5" /> Edit Content
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-xl font-bold text-neutral-900">Edit Service Content</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Content
                </label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Features <span className="font-medium text-neutral-500">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <ImageUpload
                label="Service Image"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
              />

              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                Published on the public site
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 text-xs font-bold rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
