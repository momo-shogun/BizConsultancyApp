import '@react-native-firebase/app';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';

import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App(): React.ReactElement {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProviders>
  );
}
