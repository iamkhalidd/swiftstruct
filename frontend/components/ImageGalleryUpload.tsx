'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { uploadImage } from '@/lib/cloudinary';

export interface GalleryImage {
  url: string;
  publicId?: string;
  caption?: string;
  isPrimary?: boolean;
}

interface ImageGalleryUploadProps {
  label?: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

/**
 * Multi-file picker that uploads each selected image to Cloudinary and keeps
 * exactly one of them flagged as the primary image.
 */
export default function ImageGalleryUpload({
  label = 'Images',
  images,
  onChange,
}: ImageGalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const { url, publicId } = await uploadImage(file);
        uploaded.push({
          url,
          publicId,
          isPrimary: images.length === 0 && uploaded.length === 0,
        });
      }
      onChange([...images, ...uploaded]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      return onChange(next.map((img, i) => ({ ...img, isPrimary: i === 0 })));
    }
    onChange(next);
  };

  const makePrimary = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">
        {label} <span className="font-medium text-slate-400">({images.length} uploaded)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={`${img.publicId ?? img.url}-${index}`}
            className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
          >
            <img src={img.url} alt="" className="w-full h-24 object-cover" />

            {img.isPrimary && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-extrabold uppercase rounded">
                Primary
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-slate-900/70 opacity-0 group-hover:opacity-100 transition p-1">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => makePrimary(index)}
                  title="Make primary"
                  className="p-1 text-white hover:text-blue-300"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                title="Remove"
                className="p-1 text-white hover:text-red-400 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-24 border-2 border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
          {uploading ? 'Uploading…' : 'Add images'}
        </button>
      </div>

      {error && <p className="mt-2 text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
