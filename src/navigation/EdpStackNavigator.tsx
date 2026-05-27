import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Edp from '@/features/Edp/screens/Edp';
import EDPModulesScreen from '@/features/Edp/screens/EDPModulesScreen';
import EdpOverviewVideoScreen from '@/features/Edp/screens/EdpOverviewVideoScreen';
import FdpAskQuestionsScreen from '@/features/Edp/screens/FdpAskQuestions';
import { ROUTES } from './routeNames';
import type { EdpStackParamList } from './types';
import ModuleVideoScreen from '@/features/Edp/screens/EdpVideoScreen';

const Stack = createNativeStackNavigator<EdpStackParamList>();

export function EdpStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.Edp.Main} component={Edp} />
      <Stack.Screen name={ROUTES.Edp.Modules} component={EDPModulesScreen} />
      <Stack.Screen name={ROUTES.Edp.ModuleDetail} component={ModuleVideoScreen} />
      <Stack.Screen
        name={ROUTES.Edp.OverviewVideo}
        component={EdpOverviewVideoScreen}
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      <Stack.Screen name={ROUTES.Edp.AskQuestions} component={FdpAskQuestionsScreen} />
    </Stack.Navigator>
  );
}
