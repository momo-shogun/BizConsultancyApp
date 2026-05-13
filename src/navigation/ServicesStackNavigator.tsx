import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ServicesListingScreen } from '@/features/Services/screens/ServicesListingScreen';
import { ServiceDetailScreen } from '@/features/Services/screens/ServiceDetailScreen';

import { ROUTES } from './routeNames';
import type { ServicesStackParamList } from './types';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Services.List}
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
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
        options={{ headerShown: true, title: 'Service' }}
      />
    </Stack.Navigator>
  );
}
