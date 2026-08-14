function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readMessage(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === 'string' && first.trim().length > 0) {
      return first.trim();
    }
  }
  return null;
}

export function readCallApiErrorMessage(error: unknown, fallback: string): string {
  if (isRecord(error) && 'data' in error) {
    const data = error.data;
    if (typeof data === 'string') {
      const fromString = readMessage(data);
      if (fromString != null) {
        return fromString;
      }
    }
    if (isRecord(data)) {
      const fromData = readMessage(data.message);
      if (fromData != null) {
        return fromData;
      }
    }
  }
  if (error instanceof Error) {
    const fromError = readMessage(error.message);
    if (fromError != null) {
      return fromError;
    }
  }
  return fallback;
}
