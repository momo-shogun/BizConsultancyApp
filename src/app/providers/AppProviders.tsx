import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { store, persistor } from '@/store';

import { ToastProvider } from '@/shared/components/toast';

import { CallProvider } from '@/features/Calls/providers/CallProvider';
import { ForceUpdateGate } from '@/features/ForceUpdate/components/ForceUpdateGate';

import { AuthGate } from './AuthGate';
import { AuthProvider } from './AuthProvider';
import { SessionBootstrap } from './SessionBootstrap';
import { SessionRestoreScreen } from './SessionRestoreScreen';

export function AppProviders(props: React.PropsWithChildren): React.ReactElement {
  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PersistGate
          loading={<SessionRestoreScreen />}
          persistor={persistor}
          onBeforeLift={() => setBootstrapped(true)}
        >
          <SessionBootstrap bootstrapped={bootstrapped}>
            <ToastProvider>
              <ForceUpdateGate>
                <AuthProvider>
                  <CallProvider>
                    <AuthGate>{props.children}</AuthGate>
                  </CallProvider>
                </AuthProvider>
              </ForceUpdateGate>
            </ToastProvider>
          </SessionBootstrap>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
