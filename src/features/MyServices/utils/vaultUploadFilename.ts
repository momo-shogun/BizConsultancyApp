/** Mirrors web `lib/vault-upload-filename.ts` for consistent vault file names. */

export function requirementLabelToCamelCase(label: string): string {
  const words = label
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
  if (words.length === 0) {
    return 'document';
  }
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join('');
}

export function sanitizeNameForFilename(name: string): string {
  const t = name.trim().replace(/[^a-zA-Z0-9]+/g, '');
  return (t || 'User').slice(0, 48);
}

export function extensionFromFileName(filename: string): string {
  const i = filename.lastIndexOf('.');
  if (i <= 0 || i === filename.length - 1) {
    return '';
  }
  const ext = filename.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
  return ext ? `.${ext}` : '';
}

export function extensionFromMime(mime: string): string {
  const m = mime.toLowerCase();
  if (m === 'image/png') {
    return '.png';
  }
  if (m === 'image/jpeg' || m === 'image/jpg') {
    return '.jpg';
  }
  if (m === 'image/webp') {
    return '.webp';
  }
  if (m === 'application/pdf') {
    return '.pdf';
  }
  return '';
}

export function buildVaultUploadFilename(params: {
  requirementLabel: string;
  ordinal: number;
  personDisplayName: string;
  originalFilename: string;
  mimeType: string;
}): string {
  const base = requirementLabelToCamelCase(params.requirementLabel || 'Document');
  const person = sanitizeNameForFilename(params.personDisplayName);
  const ext =
    extensionFromFileName(params.originalFilename) ||
    extensionFromMime(params.mimeType || '');
  return `${base}${params.ordinal}${person}${ext}`;
}
