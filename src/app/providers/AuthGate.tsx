import React from 'react';

import { selectIsRestoringSession } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { SessionRestoreScreen } from './SessionRestoreScreen';

interface AuthGateProps {
  children: React.ReactNode;
}

/** Blocks navigation tree until session restore completes (no login/home flicker). */
export function AuthGate(props: AuthGateProps): React.ReactElement {
  const isRestoringSession = useAppSelector(selectIsRestoringSession);

  if (isRestoringSession) {
    return <SessionRestoreScreen />;
  }

  return <>{props.children}</>;
}
