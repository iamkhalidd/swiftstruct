'use client';

import { useRef, useState } from 'react';
import { PhotoIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { uploadImage } from '@/lib/cloudinary';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
}

/**
 * File picker that uploads to Cloudinary and hands back the resulting URL.
 * Used across the admin forms in place of pasting image links.
 */
export default function ImageUpload({ label = 'Image', value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBusy = (busy: boolean) => setUploading(busy);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const { url, publicId } = await uploadImage(file);
      onChange(url, publicId);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-neutral-700 mb-1">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Current image preview"
            className="w-16 h-16 rounded-lg object-cover border border-neutral-200 bg-neutral-50"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={uploading}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-1"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-6 border-2 border-dashed border-neutral-300 rounded-lg text-xs font-bold text-neutral-500 hover:border-black hover:text-neutral-900 transition flex flex-col items-center gap-1.5 disabled:opacity-50"
        >
          {uploading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <PhotoIcon className="w-5 h-5" />
          )}
          {uploading ? 'Uploading…' : 'Click to upload an image'}
        </button>
      )}

      {uploading && value && (
        <p className="mt-2 text-[11px] text-neutral-500 flex items-center gap-1.5">
          <ArrowPathIcon className="w-3 h-3 animate-spin" /> Uploading…
        </p>
      )}
      {error && <p className="mt-2 text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
