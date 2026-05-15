import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from '@/store';

import { AuthProvider } from './AuthProvider';

export function AppProviders(props: React.PropsWithChildren): React.ReactElement {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>{props.children}</AuthProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
