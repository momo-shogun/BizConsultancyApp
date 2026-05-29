function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** Mirrors BizConsultancy `normalizeRecommendedHref` for portal parity. */
export function normalizeRecommendedHref(item: unknown): string {
  if (!isRecord(item)) {
    return '#';
  }

  const directHref = item.href ?? item.path ?? item.url;
  if (typeof directHref === 'string' && directHref.trim() !== '') {
    return directHref.trim();
  }

  const categorySlugRaw = item.categorySlug ?? item.catSlug;
  const serviceSlugRaw = item.serviceSlug ?? item.slug;
  const categorySlug =
    typeof categorySlugRaw === 'string' && categorySlugRaw.trim() !== ''
      ? categorySlugRaw.trim()
      : '';
  const serviceSlug =
    typeof serviceSlugRaw === 'string' && serviceSlugRaw.trim() !== ''
      ? serviceSlugRaw.trim()
      : '';

  if (categorySlug.length > 0 && serviceSlug.length > 0) {
    return `/services/${categorySlug}/${serviceSlug}`;
  }
  if (serviceSlug.length > 0) {
    return `/services/${serviceSlug}`;
  }

  return '#';
}

/** Service page slug for `GET public/service-pages/{slug}` (last segment under `/services/…`). */
export function extractRecommendedServiceSlug(item: unknown): string {
  if (!isRecord(item)) {
    return '';
  }

  const serviceSlugRaw = item.serviceSlug ?? item.slug;
  const standaloneSlug =
    typeof serviceSlugRaw === 'string' && serviceSlugRaw.trim() !== ''
      ? serviceSlugRaw.trim()
      : '';

  const href = normalizeRecommendedHref(item);
  if (href === '#' || href.length === 0) {
    return standaloneSlug;
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return '';
  }

  const path = href.split('?')[0] ?? href;
  const parts = path.split('/').filter((part) => part.length > 0);
  if (parts.length === 0) {
    return standaloneSlug;
  }

  if (parts[0] === 'services' && parts.length >= 2) {
    return parts[parts.length - 1] ?? standaloneSlug;
  }

  return parts[parts.length - 1] ?? standaloneSlug;
}
