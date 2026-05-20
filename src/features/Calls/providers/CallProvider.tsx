import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { CallMinimizedBar } from '../components/CallMinimizedBar';
import { callEngine } from '../engine/CallEngine';
import { callWarmupCoordinator } from '../engine/CallWarmupCoordinator';
import { startNetworkTransitionHandler, stopNetworkTransitionHandler } from '../engine/NetworkTransitionHandler';
import { startCallPushListeners } from '../services/callFirebaseMessaging';

export function CallProvider(props: React.PropsWithChildren): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  const callPhase = useAppSelector((s) => s.call.phase);
  const callPhaseRef = useRef(callPhase);
  callPhaseRef.current = callPhase;

  useEffect(() => {
    if (!isAuthenticated || token == null || token.length === 0) {
      callWarmupCoordinator.onLogout();
      callEngine.unbindSocketHandlers();
      stopNetworkTransitionHandler();
      return;
    }

    callWarmupCoordinator.onAuthenticated(token);
    callEngine.bindSocketHandlers();
    const stopPushListeners = startCallPushListeners();

    startNetworkTransitionHandler({
      onNetworkChange: () => {
        const phase = callPhaseRef.current;
        if (phase === 'in_call' || phase === 'connecting_media') {
          void callEngine.reconnectMedia();
        }
      },
    });

    return () => {
      stopPushListeners();
      stopNetworkTransitionHandler();
    };
  }, [isAuthenticated, token]);

  return (
    <View style={styles.wrap}>
      {props.children}
      <CallMinimizedBar />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});
