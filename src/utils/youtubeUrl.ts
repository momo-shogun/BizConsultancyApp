/**
 * Converts a YouTube embed URL to a watch URL for opening in the browser / YouTube app.
 */
export function youtubeEmbedToWatchUrl(embedOrUrl: string): string {
  const trimmed = embedOrUrl.trim();
  const m = trimmed.match(/youtube\.com\/embed\/([^?&#/]+)/i);
  if (m?.[1]) {
    return `https://www.youtube.com/watch?v=${m[1]}`;
  }
  return trimmed;
}
