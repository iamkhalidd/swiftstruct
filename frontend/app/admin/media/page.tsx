'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { CloudIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface MediaAsset {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.media.list();
      setAssets(data.assets || []);
      setTotal(data.total ?? data.assets?.length ?? 0);
    } catch (err: any) {
      setError(err.message || 'Could not load the media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Cloudinary Media Library</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Images uploaded through the admin, hosted on the Cloudinary CDN
          </p>
        </div>
        <button
          onClick={loadAssets}
          disabled={loading}
          className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-black/10 disabled:opacity-50"
        >
          {loading ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowPathIcon className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      <div className="bg-white px-6 py-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center">
          <CloudIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 text-base">
            {total} {total === 1 ? 'asset' : 'assets'} on the CDN
          </h3>
          <p className="text-neutral-500 text-xs">
            Files are uploaded directly from the browser using signed requests — your Cloudinary
            secret never reaches the browser.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl p-4 flex items-start gap-2">
          <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          Loading media assets…
        </div>
      ) : !error && assets.length === 0 ? (
        <div className="p-10 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          No images uploaded yet. Add images from Properties, Projects or Insights and they will
          appear here.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.publicId}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
            >
              <img
                src={asset.url}
                alt={asset.publicId.split('/').pop() || 'Cloudinary asset'}
                loading="lazy"
                className="w-full h-36 object-cover bg-neutral-50"
              />
              <div className="p-3 space-y-1">
                <p
                  className="text-[11px] font-bold text-neutral-900 truncate"
                  title={asset.publicId}
                >
                  {asset.publicId.split('/').pop()}
                </p>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">
                  {asset.format} · {asset.width}×{asset.height} · {formatSize(asset.bytes)}
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(asset.url)}
                  className="text-[10px] font-bold text-neutral-900 hover:text-neutral-600"
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
