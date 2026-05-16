/**
 * Normalizes RTK Query / fetch errors into a user-facing message.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message.trim();
      }
    }
    if (typeof data === 'string' && data.trim().length > 0) {
      return data.trim();
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
