import React, { useEffect, useRef } from 'react';

import { restoreSession } from '@/features/Auth/store/authThunks';
import { useAppDispatch } from '@/store/typedHooks';

import { SessionRestoreScreen } from './SessionRestoreScreen';

interface SessionBootstrapProps {
  children: React.ReactNode;
  bootstrapped: boolean;
}

/**
 * Runs `restoreSession` once after Redux persist rehydration.
 */
export function SessionBootstrap(props: SessionBootstrapProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const hasRestoredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!props.bootstrapped || hasRestoredRef.current) {
      return;
    }
    hasRestoredRef.current = true;
    void dispatch(restoreSession());
  }, [dispatch, props.bootstrapped]);

  if (!props.bootstrapped) {
    return <SessionRestoreScreen />;
  }

  return <>{props.children}</>;
}
