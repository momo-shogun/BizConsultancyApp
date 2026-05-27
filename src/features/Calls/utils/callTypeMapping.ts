import type { CallType } from '../types/callApi.types';

/** Maps booking `consultationType` to Agora session `callType` (web parity). */
export function consultationTypeToCallType(consultationType: string): CallType | null {
  const type = consultationType.trim().toLowerCase();
  if (type === 'phone') {
    return 'voice';
  }
  if (type === 'video') {
    return 'video';
  }
  return null;
}
