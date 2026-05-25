/**
 * Normalizes RTK Query / fetch errors into a user-facing message.
 */
function messageFromPayload(data: unknown): string | null {
  if (data == null) {
    return null;
  }
  if (typeof data === 'string' && data.trim().length > 0) {
    return data.trim();
  }
  if (typeof data !== 'object') {
    return null;
  }
  const record = data as Record<string, unknown>;
  const message = record.message;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message.trim();
  }
  if (Array.isArray(message)) {
    const parts = message
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
    if (parts.length > 0) {
      return parts.join('. ');
    }
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const parsed = messageFromPayload((error as { data?: unknown }).data);
    if (parsed != null) {
      return parsed;
    }
  }
  if (error != null && typeof error === 'object' && 'error' in error) {
    const nested = (error as { error?: unknown }).error;
    if (typeof nested === 'string' && nested.trim().length > 0) {
      return nested.trim();
    }
  }
  if (error != null && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (status === 'FETCH_ERROR') {
      return 'Network error. Check your connection and try again.';
    }
    if (status === 'PARSING_ERROR') {
      return 'Could not read the server response. Please try again.';
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  return fallback;
}
