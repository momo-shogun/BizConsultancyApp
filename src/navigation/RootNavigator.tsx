import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { linking } from './linking';
import { ROUTES } from './routeNames';
import type { RootStackParamList } from './types';
import { useRouteTracking } from './useRouteTracking';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { ConsultantDetailScreen } from '@/features/consultant/screens/ConsultantDetailScreen';
import { ConsultantViewAllScreen } from '@/features/consultant/screens/ConsultantViewAllScreen';
import WalletScreen from '@/features/Wallet/screens/WalletScreen';
import { WorkshopListScreen } from '@/features/Home/screens/WorkshopListScreen';
import { ConsultationOnboardingScreen } from '@/features/Consultation/screens/ConsultationOnboardingScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator(): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tracking = useRouteTracking(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={tracking.onReady}
      onStateChange={tracking.onStateChange}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
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

            <RootStack.Screen
              name={ROUTES.Root.Wallet}
              component={WalletScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.WorkshopsList}
              component={WorkshopListScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.ConsultationOnboarding}
              component={ConsultationOnboardingScreen}
              options={{ headerShown: false }}
            />
          </RootStack.Group>
        ) : (
          <RootStack.Screen name={ROUTES.Root.Auth} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
