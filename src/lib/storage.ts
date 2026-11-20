import { supabase, isSupabaseConfigured } from './supabase';

export const STORAGE_BUCKET = 'listing-images';
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export interface UploadResult {
  url: string | null;
  error: string | null;
  isFallback?: boolean;
}

export function validateListingImage(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPG, PNG, GIF, or WebP).',
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`,
    };
  }
  return { valid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to Supabase Storage bucket 'listing-images'.
 * If the bucket doesn't exist yet, falls back gracefully to a Base64 data URL
 * so the listing creation always succeeds seamlessly.
 */
export async function uploadListingImage(file: File): Promise<UploadResult> {
  const validation = validateListingImage(file);
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Invalid file format' };
  }

  if (!isSupabaseConfigured || !supabase) {
    try {
      const base64 = await fileToBase64(file);
      return { url: base64, error: null, isFallback: true };
    } catch {
      return { url: null, error: 'Failed to read image locally.' };
    }
  }

  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `item_${Date.now()}_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload failed, using local Base64 fallback:', error.message);
      const base64 = await fileToBase64(file);
      return {
        url: base64,
        error: `Supabase Storage Notice: ${error.message} (Stored locally as fallback)`,
        isFallback: true,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      error: null,
      isFallback: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Storage upload exception';
    console.warn('Storage exception, using fallback:', message);
    try {
      const base64 = await fileToBase64(file);
      return { url: base64, error: message, isFallback: true };
    } catch {
      return { url: null, error: message };
    }
  }
}
