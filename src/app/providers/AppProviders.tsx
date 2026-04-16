import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './AuthProvider';

export function AppProviders(props: React.PropsWithChildren): React.ReactElement {
  return (
    <SafeAreaProvider>
      <AuthProvider>{props.children}</AuthProvider>
    </SafeAreaProvider>
  );
}

