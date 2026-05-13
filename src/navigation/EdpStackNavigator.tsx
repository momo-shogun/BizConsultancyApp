import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Edp from '@/features/Edp/screens/Edp';
import EDPModulesScreen from '@/features/Edp/screens/EDPModulesScreen';
import { ROUTES } from './routeNames';
import type { EdpStackParamList } from './types';

const Stack = createNativeStackNavigator<EdpStackParamList>();

export function EdpStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.Edp.Main} component={Edp} />
      <Stack.Screen name={ROUTES.Edp.Modules} component={EDPModulesScreen} />
    </Stack.Navigator>
  );
}
