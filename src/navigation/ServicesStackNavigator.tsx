import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ServicesListingScreen } from '@/features/Services/screens/ServicesListingScreen';
import { ServiceDetailScreen } from '@/features/Services/screens/ServiceDetailScreen';

import { ROUTES } from './routeNames';
import type { ServicesStackParamList } from './types';
import Edp from '@/features/Edp/screens/Edp';
import serviceOnboarding from '@/features/Services/screens/ServiceOnboarding';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Services.List}
      screenOptions={{
        // headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={ROUTES.Services.List}
        component={ServicesListingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Services.Detail}
        component={ServiceDetailScreen}
        options={{ headerShown: false, title: 'Service' }}
      />

      <Stack.Screen
        name={ROUTES.Services.Onboarding}
        component={serviceOnboarding} // Replace with actual onboarding component
        options={{ headerShown: false, title: 'EDP' }}
      />


    </Stack.Navigator>
  );
}
