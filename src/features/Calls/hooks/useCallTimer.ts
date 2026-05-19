import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/typedHooks';

import { setElapsedSeconds } from '../store/callSlice';

/** Keeps elapsed call timer in sync while connected. */
export function useCallTimer(): number {
  const dispatch = useAppDispatch();
  const connectedAtMs = useAppSelector((s) => s.call.connectedAtMs);
  const elapsedSeconds = useAppSelector((s) => s.call.elapsedSeconds);

  useEffect(() => {
    if (connectedAtMs == null) {
      return;
    }
    const tick = setInterval(() => {
      const secs = Math.max(0, Math.floor((Date.now() - connectedAtMs) / 1000));
      dispatch(setElapsedSeconds(secs));
    }, 1000);
    return () => clearInterval(tick);
  }, [connectedAtMs, dispatch]);

  return elapsedSeconds;
}
