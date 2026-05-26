/**
 * Extracts a YouTube video id from common watch, embed, and youtu.be URLs.
 */
export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Returns a YouTube thumbnail URL for the given video link, or null if id cannot be parsed.
 */
export function getYouTubeThumbnailUrl(
  url: string,
  quality: 'hqdefault' | 'mqdefault' = 'hqdefault',
): string | null {
  const id = getYouTubeVideoId(url);
  return id != null ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
}

/**
 * Converts a YouTube embed URL to a watch URL for opening in the browser / YouTube app.
 */
export function youtubeEmbedToWatchUrl(embedOrUrl: string): string {
  const trimmed = embedOrUrl.trim();
  const m = trimmed.match(/youtube\.com\/embed\/([^?&#/]+)/i);
  if (m?.[1]) {
    return `https://www.youtube.com/watch?v=${m[1]}`;
  }
  const id = getYouTubeVideoId(trimmed);
  if (id != null) {
    return `https://www.youtube.com/watch?v=${id}`;
  }
  return trimmed;
}
