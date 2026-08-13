export interface LocationAnswer {
  stateId: number;
  stateLabel: string;
  cityId: number;
  cityLabel: string;
}

export interface LocationSelectOption {
  value: number;
  label: string;
}

export function parseLocationAnswer(value: unknown): LocationAnswer | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const rec = value as Record<string, unknown>;
  const stateId = Number(rec.stateId);
  const cityId = Number(rec.cityId);
  const stateLabel = String(rec.stateLabel ?? '').trim();
  const cityLabel = String(rec.cityLabel ?? '').trim();
  if (!Number.isFinite(stateId) || stateId <= 0) {
    return null;
  }
  if (!Number.isFinite(cityId) || cityId <= 0) {
    return null;
  }
  if (stateLabel.length === 0 || cityLabel.length === 0) {
    return null;
  }
  return { stateId, stateLabel, cityId, cityLabel };
}

export function parseLocationDraft(value: unknown): {
  stateId: number | null;
  stateLabel: string;
  cityId: number | null;
  cityLabel: string;
} {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return { stateId: null, stateLabel: '', cityId: null, cityLabel: '' };
  }
  const rec = value as Record<string, unknown>;
  const stateIdRaw = Number(rec.stateId);
  const cityIdRaw = Number(rec.cityId);
  return {
    stateId: Number.isFinite(stateIdRaw) && stateIdRaw > 0 ? stateIdRaw : null,
    stateLabel: String(rec.stateLabel ?? '').trim(),
    cityId: Number.isFinite(cityIdRaw) && cityIdRaw > 0 ? cityIdRaw : null,
    cityLabel: String(rec.cityLabel ?? '').trim(),
  };
}

export function formatLocationAnswerDisplay(value: unknown): string {
  const loc = parseLocationAnswer(value);
  if (loc == null) {
    return '';
  }
  return `${loc.cityLabel}, ${loc.stateLabel}`;
}

export function isLocationAnswerComplete(value: unknown, required: boolean): boolean {
  if (parseLocationAnswer(value) != null) {
    return true;
  }
  const draft = parseLocationDraft(value);
  const started = draft.stateId != null || draft.cityId != null;
  if (!required && !started) {
    return true;
  }
  return false;
}

export function parseLocationSelectOptions(raw: unknown): LocationSelectOption[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: LocationSelectOption[] = [];
  for (const row of raw) {
    if (row == null || typeof row !== 'object') {
      continue;
    }
    const rec = row as { value?: unknown; label?: unknown };
    const value = Number(rec.value);
    const label = String(rec.label ?? '').trim();
    if (!Number.isFinite(value) || value <= 0 || label.length === 0) {
      continue;
    }
    out.push({ value, label });
  }
  return out;
}
