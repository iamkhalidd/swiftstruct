'use client';

import { Image, Cloud } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Cloudinary Media Library</h1>
        <p className="text-slate-500 text-xs mt-0.5">Central media storage and Cloudinary CDN references</p>
      </div>

      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Cloudinary Integration Active</h3>
            <p className="text-slate-500 text-xs">Media assets for properties, projects, and insights are hosted on Cloudinary CDN.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
