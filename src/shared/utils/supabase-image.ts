const BUCKET = 'food_images';

/** Приводит URL изображения Supabase к публичному виду */
export function normalizeSupabaseImageUrl(image: string | null | undefined): string | null {
  if (!image?.trim()) return null;

  const trimmed = image.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  if (!base) return trimmed;

  const path = trimmed.startsWith(`${BUCKET}/`) ? trimmed : `${BUCKET}/${trimmed.replace(/^\//, '')}`;
  return `${base}/storage/v1/object/public/${path}`;
}
