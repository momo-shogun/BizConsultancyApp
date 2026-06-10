import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AppTabParamList } from '../types';
import { ROUTES } from '../routeNames';

import { selectEffectiveAccountRole } from '@/features/Auth/store/authSelectors';
import { HomeDashboardScreen } from '@/features/Home/screens/HomeDashboardScreen';
import { ServicesStackNavigator } from '../ServicesStackNavigator';
import Edp from '@/features/Edp/screens/Edp';
import { useAppSelector } from '@/store/typedHooks';
import { AccountTabHost } from '../account/AccountTabHost';
import { accountTabListeners } from '../tabBar/accountTabListeners';
import { servicesTabListeners } from '../tabBar/servicesTabListeners';

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
  const accountRole = useAppSelector(selectEffectiveAccountRole);
  const showEdpTab = accountRole !== 'consultant';

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
        listeners={servicesTabListeners}
        options={{ title: 'Services' }}
      />
      {showEdpTab ? (
        <Tab.Screen name={ROUTES.App.Edp} component={Edp} options={{ title: 'EDP' }} />
      ) : null}
      <Tab.Screen
        name={ROUTES.App.Account}
        component={AccountTabHost}
        listeners={accountTabListeners}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
}

