'use client';

import { useRef, useState } from 'react';
import { PhotoIcon, ArrowPathIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      <label className="block text-xs font-bold text-neutral-700 mb-1">
        {label} <span className="font-medium text-neutral-500">({images.length} uploaded)</span>
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
            className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50"
          >
            <img
              src={img.url}
              alt={img.caption || 'Uploaded image preview'}
              className="w-full h-24 object-cover"
            />

            {img.isPrimary && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-extrabold uppercase rounded">
                Primary
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/40 opacity-0 group-hover:opacity-100 transition p-1">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => makePrimary(index)}
                  aria-label={`Make image ${index + 1} the primary image`}
                  title="Make primary"
                  className="p-2 text-white hover:text-neutral-300"
                >
                  <StarIcon className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove image ${index + 1}`}
                title="Remove"
                className="p-2 text-white hover:text-red-400 ml-auto"
              >
                <TrashIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-24 border-2 border-dashed border-neutral-300 rounded-lg text-[10px] font-bold text-neutral-500 hover:border-black hover:text-neutral-900 transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
        >
          {uploading ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <PhotoIcon className="w-4 h-4" />
          )}
          {uploading ? 'Uploading…' : 'Add images'}
        </button>
      </div>

      {error && <p className="mt-2 text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
