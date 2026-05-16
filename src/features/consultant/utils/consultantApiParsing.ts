import type { ConsultantDetail } from '../types/consultantDetail.types';
import type { AvailableSlot, AvailableSlotsResponse } from '../types/consultantApi.types';
import { normalizePublicConsultant } from './consultantMappers';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function parseSingleConsultantResponse(raw: unknown): ConsultantDetail | null {
  if (!isRecord(raw)) {
    return normalizePublicConsultant(raw);
  }
  const nested = raw.data ?? raw.consultant;
  return normalizePublicConsultant(nested ?? raw);
}

export function parsePublicConsultantsResponse(raw: unknown): ConsultantDetail[] {
  const tryList = (items: unknown[]): ConsultantDetail[] => {
    const result: ConsultantDetail[] = [];
    for (const item of items) {
      const detail = normalizePublicConsultant(item);
      if (detail != null) {
        result.push(detail);
      }
    }
    return result;
  };

  if (Array.isArray(raw)) {
    return tryList(raw);
  }
  if (!isRecord(raw)) {
    return [];
  }
  const keys = ['data', 'consultants', 'items', 'results'] as const;
  for (const key of keys) {
    const nested = raw[key];
    if (Array.isArray(nested)) {
      return tryList(nested);
    }
  }
  return [];
}

function isAvailableSlot(value: unknown): value is AvailableSlot {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.startTime === 'string';
}

export function parseAvailableSlotsResponse(raw: unknown): AvailableSlotsResponse {
  if (Array.isArray(raw)) {
    return { slots: raw.filter(isAvailableSlot) };
  }
  if (!isRecord(raw)) {
    return { slots: [] };
  }
  const nested = raw.slots ?? raw.data ?? raw.availableSlots;
  if (Array.isArray(nested)) {
    return { slots: nested.filter(isAvailableSlot) };
  }
  return { slots: [] };
}
