import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  useAddEdpWatchTimeMutation,
  type EdpWatchTimeSource,
} from '@/features/Edp/api/edpProgressApi';
import { selectToken } from '@/features/Auth/store/authSelectors';

const HEARTBEAT_SEC = 60;
const THROTTLE_MS = 7000;

export interface EdpWatchProgressContext {
  categoryId: number;
  subCategoryId: number;
}

export interface UseEdpWatchTimeHeartbeatParams {
  enabled: boolean;
  context: EdpWatchProgressContext | null;
  isPlaying: boolean;
  onProgressRecorded?: () => void;
}

export interface UseEdpWatchTimeHeartbeatResult {
  reportReadingTime: (seconds: number, overrideContext?: EdpWatchProgressContext) => void;
}

export function useEdpWatchTimeHeartbeat(
  params: UseEdpWatchTimeHeartbeatParams,
): UseEdpWatchTimeHeartbeatResult {
  const { enabled, context, isPlaying, onProgressRecorded } = params;
  const token = useSelector(selectToken);
  const [addWatchTime] = useAddEdpWatchTimeMutation();
  const videoThrottleRef = useRef(0);
  const pdfThrottleRef = useRef(0);

  const sendProgress = useCallback(
    (
      source: EdpWatchTimeSource,
      seconds: number,
      overrideContext?: EdpWatchProgressContext,
    ): void => {
      const ctx = overrideContext ?? context;
      if (token == null || token.length === 0 || !enabled || ctx == null || seconds < 1) {
        return;
      }
      if (
        !Number.isFinite(ctx.categoryId) ||
        ctx.categoryId < 1 ||
        !Number.isFinite(ctx.subCategoryId) ||
        ctx.subCategoryId < 1
      ) {
        return;
      }
      const now = Date.now();
      const throttleRef = source === 'video' ? videoThrottleRef : pdfThrottleRef;
      if (now - throttleRef.current < THROTTLE_MS) {
        return;
      }
      throttleRef.current = now;
      void addWatchTime({
        categoryId: ctx.categoryId,
        subCategoryId: ctx.subCategoryId,
        secondsWatched: Math.min(600, Math.floor(seconds)),
        source,
      })
        .unwrap()
        .then(() => {
          onProgressRecorded?.();
        })
        .catch(() => {
          /* non-blocking — matches web */
        });
    },
    [addWatchTime, context, enabled, onProgressRecorded, token],
  );

  useEffect(() => {
    if (!enabled || !isPlaying || context == null || token == null || token.length === 0) {
      return;
    }
    const intervalId = setInterval(() => {
      sendProgress('video', HEARTBEAT_SEC);
    }, HEARTBEAT_SEC * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [context, enabled, isPlaying, sendProgress, token]);

  const reportReadingTime = useCallback(
    (seconds: number, overrideContext?: EdpWatchProgressContext): void => {
      sendProgress('pdf', seconds, overrideContext);
    },
    [sendProgress],
  );

  return { reportReadingTime };
}
