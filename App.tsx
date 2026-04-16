import React from 'react';
import { StatusBar } from 'react-native';

import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App(): React.ReactElement {
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProviders>
  );
}
