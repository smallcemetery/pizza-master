type DadataAddressData = {
  city?: string | null;
  settlement?: string | null;
  street?: string | null;
  street_with_type?: string | null;
  house?: string | null;
  flat?: string | null;
};

export function formatShortAddress(data: DadataAddressData): string {
  const cityRaw = data.city || data.settlement;
  const cityPart = cityRaw ? `г. ${cityRaw.replace(/^г\.?\s*/i, '').trim()}` : '';

  const streetSource = data.street_with_type || data.street || '';
  let streetPart = '';
  if (streetSource) {
    const name = streetSource
      .replace(/^(ул\.?\s*|улица\s*)/i, '')
      .trim();
    streetPart = name ? `ул. ${name}` : '';
  }

  const housePart = data.house?.trim() ?? '';
  const flatPart = data.flat?.trim() ? `кв ${data.flat.trim()}` : '';

  return [cityPart, streetPart, housePart, flatPart].filter(Boolean).join(' ');
}
