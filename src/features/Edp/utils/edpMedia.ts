import { AWS_S3_PUBLIC_BASE_URL } from '@/constants/api';

/** Module overview PDF on IID S3 (`edp/M-1.pdf`, …) — matches web `/edp` landing. */
export function resolveEdpOverviewModulePdfUrl(moduleIndex: number): string {
  return `${AWS_S3_PUBLIC_BASE_URL}/edp/M-${moduleIndex + 1}.pdf`;
}

export function resolveIidAssetUrl(path: string | undefined | null): string | null {
  if (path == null) {
    return null;
  }
  const trimmed = path.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `${AWS_S3_PUBLIC_BASE_URL}/${trimmed.replace(/^\/+/, '')}`;
}

export function extractYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtube.com')) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery != null && fromQuery.length > 0) {
        return fromQuery;
      }
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1] != null) {
        return embedMatch[1];
      }
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      return id.length > 0 ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

/** YouTube CDN thumbnail for lesson rows (mq = 320×180). */
export function resolveYoutubeThumbnailUrl(url: string | null | undefined): string | null {
  if (url == null || url.trim().length === 0) {
    return null;
  }
  const videoId = extractYoutubeVideoId(url);
  if (videoId == null) {
    return null;
  }
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function isYoutubeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  return trimmed.includes('youtube.com') || trimmed.includes('youtu.be');
}

function buildYoutubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    fs: '1',
    controls: '1',
    iv_load_policy: '3',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export type EdpVideoEmbedKind = 'youtube' | 'iframe' | 'video';

export interface EdpVideoEmbed {
  kind: EdpVideoEmbedKind;
  src: string;
  youtubeVideoId: string | null;
}

/** Matches web `resolveEdpVideoEmbed` / overview modal player rules. */
export function resolveEdpVideoEmbed(url: string): EdpVideoEmbed {
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return { kind: 'iframe', src: trimmed, youtubeVideoId: null };
  }

  const youtubeVideoId = extractYoutubeVideoId(trimmed);
  if (youtubeVideoId != null) {
    return {
      kind: 'youtube',
      src: buildYoutubeEmbedSrc(youtubeVideoId),
      youtubeVideoId,
    };
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return { kind: 'iframe', src: trimmed, youtubeVideoId: null };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      return { kind: 'iframe', src: trimmed, youtubeVideoId: null };
    }
    if (parsed.hostname.includes('vimeo.com')) {
      if (parsed.hostname.includes('player.vimeo.com')) {
        const separator = trimmed.includes('?') ? '&' : '?';
        return {
          kind: 'iframe',
          src: `${trimmed}${separator}autoplay=1`,
          youtubeVideoId: null,
        };
      }
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (id != null && /^\d+$/.test(id)) {
        return {
          kind: 'iframe',
          src: `https://player.vimeo.com/video/${id}?autoplay=1`,
          youtubeVideoId: null,
        };
      }
    }
  } catch {
    /* fall through */
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
    return { kind: 'video', src: trimmed, youtubeVideoId: null };
  }

  return { kind: 'iframe', src: trimmed, youtubeVideoId: null };
}
