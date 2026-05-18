import React, { useEffect } from 'react';

import { navigationRef } from '@/navigation/RootNavigator';
import { ROUTES } from '@/navigation/routeNames';
import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { IncomingCallModal } from '../components/IncomingCallModal';
import { callEngine } from '../engine/CallEngine';
import { callWarmupCoordinator } from '../engine/CallWarmupCoordinator';
import { startNetworkTransitionHandler, stopNetworkTransitionHandler } from '../engine/NetworkTransitionHandler';

export function CallProvider(props: React.PropsWithChildren): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    callEngine.setNavigator((screen, params) => {
      if (!navigationRef.isReady()) {
        return;
      }
      if (screen === 'OutgoingCall') {
        navigationRef.navigate(ROUTES.Root.OutgoingCall, params);
      } else {
        navigationRef.navigate(ROUTES.Root.InCall, params);
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || token == null || token.length === 0) {
      callWarmupCoordinator.onLogout();
      stopNetworkTransitionHandler();
      return;
    }

    callWarmupCoordinator.onAuthenticated(token);
    callEngine.bindSocketHandlers();

    startNetworkTransitionHandler({
      onNetworkChange: () => {
        void callEngine.reconnectMedia();
      },
    });

    return () => {
      stopNetworkTransitionHandler();
    };
  }, [isAuthenticated, token]);

  return (
    <>
      {props.children}
      <IncomingCallModal />
    </>
  );
}
