import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import WalletTransactionsScreen from '@/features/Wallet/screens/WalletTransactionsScreen';
import { WorkshopListScreen } from '@/features/Home/screens/WorkshopListScreen';
import { ConsultationOnboardingScreen } from '@/features/Consultation/screens/ConsultationOnboardingScreen';
import { IncomingCallScreen } from '@/features/Calls/screens/IncomingCallScreen';
import { OutgoingCallScreen } from '@/features/Calls/screens/OutgoingCallScreen';
import { InCallScreen } from '@/features/Calls/screens/InCallScreen';
import WorkshopDetailsScreen from '@/features/Home/screens/WorkshopDetailsScreen';
import { BizAIScreen } from '@/features/BizAI/screens/BizAIScreen';
import { SearchScreen } from '@/features/Search/screens/SearchScreen';
import { BusinessDiagnosisScreen } from '@/features/Diagnostics/screens/BusinessDiagnosisScreen';
import { ConsultantBookingsScreen } from '@/features/Bookings/screens/ConsultantBookingsScreen';
import { MyBookingsScreen } from '@/features/Bookings/screens/MyBookingsScreen';
import { callEngine } from '@/features/Calls/engine/CallEngine';

import { navigationRef } from './navigationContainerRef';
import { rootSlideFromRightScreenOptions } from './rootStackScreenOptions';

const RootStack = createNativeStackNavigator<RootStackParamList>();

/** @deprecated Prefer `@/navigation/navigationContainerRef` to avoid cyclic imports */
export { navigationRef } from './navigationContainerRef';

export function RootNavigator(): React.ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tracking = useRouteTracking(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        tracking.onReady();
        callEngine.flushPendingCallNavigation();
        callEngine.flushPendingAccept();
      }}
      onStateChange={tracking.onStateChange}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Group>
            <RootStack.Screen name={ROUTES.Root.App} component={AppNavigator} />
            <RootStack.Screen
              name={ROUTES.Root.ConsultantsList}
              component={ConsultantViewAllScreen}
              options={rootSlideFromRightScreenOptions}
            />
            <RootStack.Screen
              name={ROUTES.Root.ConsultantDetail}
              component={ConsultantDetailScreen}
              options={rootSlideFromRightScreenOptions}
            />

            <RootStack.Screen
              name={ROUTES.Root.Wallet}
              component={WalletScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.WalletTransactions}
              component={WalletTransactionsScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.Search}
              component={SearchScreen}
              options={{
                headerShown: false,
                animation: 'fade_from_bottom',
                presentation: 'transparentModal',
                contentStyle: { backgroundColor: 'transparent' },
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
              }}
            />
            <RootStack.Screen
              name={ROUTES.Root.BizAI}
              component={BizAIScreen}
              options={{
                headerShown: false,
                animation: 'fade_from_bottom',
                presentation: 'fullScreenModal',
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
              }}
            />
            <RootStack.Screen
              name={ROUTES.Root.BusinessDiagnosis}
              component={BusinessDiagnosisScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.MyBookings}
              component={MyBookingsScreen}
              options={rootSlideFromRightScreenOptions}
            />
            <RootStack.Screen
              name={ROUTES.Root.ConsultantBookings}
              component={ConsultantBookingsScreen}
              options={rootSlideFromRightScreenOptions}
            />
            <RootStack.Screen
              name={ROUTES.Root.WorkshopsList}
              component={WorkshopListScreen}
              options={rootSlideFromRightScreenOptions}
            />
            <RootStack.Screen
              name={ROUTES.Root.WorkshopsDetail}
              component={WorkshopDetailsScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.ConsultationOnboarding}
              component={ConsultationOnboardingScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name={ROUTES.Root.IncomingCall}
              component={IncomingCallScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
                gestureEnabled: false,
              }}
            />
            <RootStack.Screen
              name={ROUTES.Root.OutgoingCall}
              component={OutgoingCallScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
                gestureEnabled: false,
              }}
            />
            <RootStack.Screen
              name={ROUTES.Root.InCall}
              component={InCallScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
                gestureEnabled: false,
              }}
            />
          </RootStack.Group>
        ) : (
          <RootStack.Screen name={ROUTES.Root.Auth} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
