import type { FetchArgs } from '@reduxjs/toolkit/query';

function resolveRequestMeta(args: string | FetchArgs): { method: string; url: string } {
  if (typeof args === 'string') {
    return { method: 'GET', url: args };
  }
  return {
    method: args.method ?? 'GET',
    url: args.url,
  };
}

/** Dev-only logging for RTK Query traffic (raw response before transformResponse). */
export function logApiResponse(
  args: string | FetchArgs,
  payload: { request?: unknown; response?: unknown; error?: unknown },
): void {
  if (!__DEV__) {
    return;
  }

  const { method, url } = resolveRequestMeta(args);

  if (payload.error != null) {
    console.log(`[API] ${method} ${url} — error`, payload.error);
    return;
  }

  console.log(`[API] ${method} ${url}`, {
    request: payload.request,
    response: payload.response,
  });
}
