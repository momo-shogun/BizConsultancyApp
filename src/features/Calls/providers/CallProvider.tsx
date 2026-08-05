import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { Dialog } from '@/shared/components/dialog';
import { useAppSelector } from '@/store/typedHooks';

import { CallMinimizedBar } from '../components/CallMinimizedBar';
import { callEngine } from '../engine/CallEngine';
import { callWarmupCoordinator } from '../engine/CallWarmupCoordinator';
import { startNetworkTransitionHandler, stopNetworkTransitionHandler } from '../engine/NetworkTransitionHandler';
import {
  getPendingAndroidCallDisplayPrompt,
  markBatteryOptimizationPromptDismissed,
  markFullScreenIntentPromptDismissed,
  openBatteryOptimizationSettings,
  openFullScreenIntentSettings,
  type AndroidCallDisplayPrompt,
} from '../services/androidCallDisplayPermissions';
import { consumeNativePendingIncomingCall } from '../services/consumeNativePendingIncomingCall';
import { isDeviceLocked } from '../services/callLockScreenBridge';
import { startCallPushListeners } from '../services/callFirebaseMessaging';
import { consumeInitialOngoingCallNotification } from '../services/callNotifeeEvents';

const CALL_ONLY_ROUTES = new Set<string>([
  ROUTES.Root.IncomingCall,
  ROUTES.Root.OutgoingCall,
  ROUTES.Root.InCall,
]);

function isActiveCallPhase(phase: string): boolean {
  return (
    phase === 'incoming_ringing' ||
    phase === 'outgoing_ringing' ||
    phase === 'outgoing_initiating' ||
    phase === 'connecting_media' ||
    phase === 'in_call' ||
    phase === 'reconnecting'
  );
}

function promptCopy(kind: AndroidCallDisplayPrompt): { title: string; description: string } {
  if (kind === 'battery_optimization') {
    return {
      title: 'Allow background calls',
      description:
        'Battery optimization can block incoming calls when the app is closed. Disable it for reliable call alerts.',
    };
  }
  return {
    title: 'Allow full-screen calls',
    description:
      'Enable full-screen notifications so incoming calls can appear over the lock screen when the app is closed.',
  };
}

export function CallProvider(props: React.PropsWithChildren): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  const callPhase = useAppSelector((s) => s.call.phase);
  const callSessionId = useAppSelector((s) => s.call.sessionId);
  const callPhaseRef = useRef(callPhase);
  callPhaseRef.current = callPhase;
  const callSessionIdRef = useRef(callSessionId);
  callSessionIdRef.current = callSessionId;

  const [displayPrompt, setDisplayPrompt] = useState<AndroidCallDisplayPrompt>(null);

  const refreshDisplayPrompt = useCallback((): void => {
    void getPendingAndroidCallDisplayPrompt().then((pending) => {
      setDisplayPrompt(pending);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || token == null || token.length === 0) {
      callEngine.unbindSocketHandlers();
      stopNetworkTransitionHandler();
      setDisplayPrompt(null);
      return;
    }

    callWarmupCoordinator.onAuthenticated(token);
    callEngine.bindSocketHandlers();
    callEngine.flushPendingCallNavigation();
    callEngine.flushPendingAccept();
    void callEngine.restoreActiveCallIfNeeded();
    void consumeInitialOngoingCallNotification();
    void consumeNativePendingIncomingCall().then((handled) => {
      if (handled) {
        callEngine.flushPendingAccept();
      }
    });
    const stopPushListeners = startCallPushListeners();
    refreshDisplayPrompt();

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
  }, [isAuthenticated, token, refreshDisplayPrompt]);

  /**
   * Lock screen: if navigation somehow leaves the call stack, force the call UI back.
   * Prevents browsing Home/Account while the keyguard is still locked.
   */
  useEffect(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const enforceCallOnlyWhenLocked = (): void => {
      void isDeviceLocked().then((locked) => {
        if (!locked) {
          return;
        }
        const phase = callPhaseRef.current;
        const sessionId = callSessionIdRef.current;
        if (!isActiveCallPhase(phase) || sessionId == null) {
          return;
        }
        const routeName = navigationRef.getCurrentRoute()?.name;
        if (routeName != null && CALL_ONLY_ROUTES.has(routeName)) {
          return;
        }
        if (phase === 'incoming_ringing') {
          navigationRef.navigate(ROUTES.Root.IncomingCall as never, { sessionId } as never);
          return;
        }
        if (phase === 'outgoing_ringing' || phase === 'outgoing_initiating') {
          navigationRef.navigate(ROUTES.Root.OutgoingCall as never, { sessionId } as never);
          return;
        }
        navigationRef.navigate(ROUTES.Root.InCall as never, { sessionId } as never);
      });
    };

    const unsubscribe = navigationRef.addListener('state', enforceCallOnlyWhenLocked);
    enforceCallOnlyWhenLocked();
    return unsubscribe;
  }, [callPhase, callSessionId, isAuthenticated]);

  const closePrompt = useCallback((): void => {
    if (displayPrompt === 'full_screen_intent') {
      markFullScreenIntentPromptDismissed();
    } else if (displayPrompt === 'battery_optimization') {
      markBatteryOptimizationPromptDismissed();
    }
    setDisplayPrompt(null);
    refreshDisplayPrompt();
  }, [displayPrompt, refreshDisplayPrompt]);

  const openPromptSettings = useCallback((): void => {
    const kind = displayPrompt;
    if (kind === 'full_screen_intent') {
      markFullScreenIntentPromptDismissed();
      void openFullScreenIntentSettings();
    } else if (kind === 'battery_optimization') {
      markBatteryOptimizationPromptDismissed();
      void openBatteryOptimizationSettings();
    }
    setDisplayPrompt(null);
  }, [displayPrompt]);

  const copy = promptCopy(displayPrompt);

  return (
    <View style={styles.wrap}>
      {props.children}
      <CallMinimizedBar />
      <Dialog
        visible={displayPrompt != null}
        onClose={closePrompt}
        variant="warning"
        title={copy.title}
        description={copy.description}
        actions={[
          { label: 'Not now', variant: 'ghost', onPress: closePrompt },
          { label: 'Open settings', onPress: openPromptSettings },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});
