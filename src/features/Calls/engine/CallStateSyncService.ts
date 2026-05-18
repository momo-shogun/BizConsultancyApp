import { callsApi } from '../api/callsApi';
import { setLastEventVersion } from '../store/callSlice';
import { store } from '@/store';

export async function syncCallSession(
  sessionId: number,
  sinceVersion?: number,
): Promise<void> {
  const result = await store.dispatch(
    callsApi.endpoints.syncCall.initiate({ sessionId, sinceVersion }),
  );
  if ('data' in result && result.data != null) {
    store.dispatch(setLastEventVersion(result.data.lastEventVersion));
  }
}
