import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AppTabParamList } from '../types';
import { ROUTES } from '../routeNames';

import { HomeDashboardScreen } from '@/features/Home/screens/HomeDashboardScreen';
import { ServicesStackNavigator } from '../ServicesStackNavigator';
import { BookingsScreen } from '@/features/Bookings/screens/BookingsScreen';
import { ProfileScreen } from '@/features/Profile/screens/ProfileScreen';
import Edp from '@/features/Edp/screens/Edp';

const Tab = createBottomTabNavigator<AppTabParamList>();

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
      case ROUTES.App.Edp:
        return focused ? 'calendar' : 'calendar-outline';
      case ROUTES.App.Account:
        return focused ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  })();

  return <Ionicons name={iconName} size={size} color={color} />;
}

export function BottomTabNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
      })}
    >
      <Tab.Screen name={ROUTES.App.Home} component={HomeDashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name={ROUTES.App.Services}
        component={ServicesStackNavigator}
        options={{ title: 'Services' }}
      />
      <Tab.Screen
        name={ROUTES.App.Edp}
        component={Edp}
        options={{ title: 'EDP' }}
      />
      <Tab.Screen name={ROUTES.App.Account} component={ProfileScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

