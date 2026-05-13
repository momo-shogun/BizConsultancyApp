import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AppTabParamList } from '../../types';
import { ROUTES } from '../../routeNames';
import { PlanckBridgedTabBar } from '../../shared/PlanckBridgedTabBar';

import { HomeDashboardScreen } from '@/features/Home/screens/HomeDashboardScreen';
import { BookingsScreen } from '@/features/Bookings/screens/BookingsScreen';
import { ProfileScreen } from '@/features/Profile/screens/ProfileScreen';

import { ServicesStackNavigator } from '../../ServicesStackNavigator';
import { plankBarV1TabNavigatorScreenOptions } from './plankBarV1.styles';

const PlankTab = createBottomTabNavigator<AppTabParamList>();

function getTabBarIcon(
  routeName: keyof AppTabParamList,
  focused: boolean,
  color: string,
  size: number,
): React.ReactElement {
  const iconName = (() => {
    switch (routeName) {
      case ROUTES.App.Home:
        return focused ? 'home' : 'home-outline';
      case ROUTES.App.Services:
        return focused ? 'briefcase' : 'briefcase-outline';
      case ROUTES.App.Bookings:
        return focused ? 'calendar' : 'calendar-outline';
      case ROUTES.App.Account:
        return focused ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  })();

  return <Ionicons name={iconName} size={size} color={color} />;
}

export function PlankBarV1TabNavigator(): React.ReactElement {
  return (
    <PlankTab.Navigator
      initialRouteName={ROUTES.App.Home}
      screenOptions={({ route }) => ({
        ...plankBarV1TabNavigatorScreenOptions,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
      })}
      tabBar={(props: BottomTabBarProps) => (
        <PlanckBridgedTabBar {...props} tabBarVariant="plankBarV1" />
      )}
    >
      <PlankTab.Screen name={ROUTES.App.Home} component={HomeDashboardScreen} options={{ title: 'Home' }} />
      <PlankTab.Screen
        name={ROUTES.App.Services}
        component={ServicesStackNavigator}
        options={{ title: 'Services' }}
      />
      <PlankTab.Screen
        name={ROUTES.App.Bookings}
        component={BookingsScreen}
        options={{ title: 'EDP' }}
      />
      <PlankTab.Screen name={ROUTES.App.Account} component={ProfileScreen} options={{ title: 'Account' }} />
    </PlankTab.Navigator>
  );
}
