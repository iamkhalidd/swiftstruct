import { adminApi } from './adminApi';

export interface UploadedImage {
  url: string;
  publicId: string;
}

/**
 * Uploads a file straight from the browser to Cloudinary, using a short-lived
 * signature issued by our own API. The api_secret stays on the server.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const { signature, timestamp, cloudName, apiKey, folder } = await adminApi.media.signature();

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error?.message || `Image upload failed (HTTP ${res.status})`);
  }

  return { url: data.secure_url as string, publicId: data.public_id as string };
}
