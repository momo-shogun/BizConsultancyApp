import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';

import { linking } from './linking';
import { ROUTES } from './routeNames';
import type { RootStackParamList } from './types';
import { useRouteTracking } from './useRouteTracking';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { ConsultantDetailScreen } from '@/features/consultant/screens/ConsultantDetailScreen';
import { ConsultantViewAllScreen } from '@/features/consultant/screens/ConsultantViewAllScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator(): React.ReactElement {
  const { state } = useAuth();
  const tracking = useRouteTracking(navigationRef);

  return (
    <NavigationContainer ref={navigationRef} linking={linking} onReady={tracking.onReady} onStateChange={tracking.onStateChange}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isAuthenticated ? (
          <RootStack.Screen name={ROUTES.Root.Auth} component={AuthNavigator} />
        ) : (
          <RootStack.Group>
            <RootStack.Screen name={ROUTES.Root.App} component={AppNavigator} />
            <RootStack.Screen
              name={ROUTES.Root.ConsultantsList}
              component={ConsultantViewAllScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name={ROUTES.Root.ConsultantDetail}
              component={ConsultantDetailScreen}
              options={{ headerShown: false }}
            />
          </RootStack.Group>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

