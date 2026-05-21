function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readMessageField(message: unknown): string | null {
  if (typeof message === 'string' && message.trim().length > 0) {
    return message.trim();
  }
  if (Array.isArray(message)) {
    const parts = message.filter((part): part is string => typeof part === 'string' && part.trim().length > 0);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return null;
}

export function readWorkshopBookingErrorMessage(error: unknown): string {
  if (isRecord(error) && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data.trim();
    }
    if (isRecord(data)) {
      const fromMessage = readMessageField(data.message);
      if (fromMessage != null) {
        return fromMessage;
      }
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return 'Booking failed. Please try again.';
}
