import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
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
import { startCallPushListeners } from '../services/callFirebaseMessaging';

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
  const callPhaseRef = useRef(callPhase);
  callPhaseRef.current = callPhase;

  const [displayPrompt, setDisplayPrompt] = useState<AndroidCallDisplayPrompt>(null);

  const refreshDisplayPrompt = useCallback((): void => {
    void getPendingAndroidCallDisplayPrompt().then((pending) => {
      setDisplayPrompt(pending);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || token == null || token.length === 0) {
      callWarmupCoordinator.onLogout();
      callEngine.unbindSocketHandlers();
      stopNetworkTransitionHandler();
      setDisplayPrompt(null);
      return;
    }

    callWarmupCoordinator.onAuthenticated(token);
    callEngine.bindSocketHandlers();
    callEngine.flushPendingCallNavigation();
    callEngine.flushPendingAccept();
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
