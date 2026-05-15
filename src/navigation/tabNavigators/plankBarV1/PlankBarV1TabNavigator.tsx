import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AppTabParamList } from '../../types';
import { ROUTES } from '../../routeNames';
import { PlanckBridgedTabBar } from '../../shared/PlanckBridgedTabBar';
import { isTabBarHiddenFromOptions } from '../../tabBar/isTabBarHiddenFromOptions';
import { getStackTabScreenOptions } from '../../tabBar/tabBarVisibility';

import { HomeDashboardScreen } from '@/features/Home/screens/HomeDashboardScreen';

import { AccountStackNavigator } from '../../AccountStackNavigator';
import { ServicesStackNavigator } from '../../ServicesStackNavigator';
import { plankBarV1TabNavigatorScreenOptions } from './plankBarV1.styles';
import { EdpStackNavigator } from '../../EdpStackNavigator';

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

function PlankTabBar(props: BottomTabBarProps): React.ReactElement | null {
  const focusedKey = props.state.routes[props.state.index].key;
  const options = props.descriptors[focusedKey].options;

  if (isTabBarHiddenFromOptions(options)) {
    return null;
  }

  return <PlanckBridgedTabBar {...props} tabBarVariant="plankBarV1" />;
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
      tabBar={PlankTabBar}
    >
      <PlankTab.Screen name={ROUTES.App.Home} component={HomeDashboardScreen} options={{ title: 'Home' }} />
      <PlankTab.Screen
        name={ROUTES.App.Services}
        component={ServicesStackNavigator}
        options={({ route }) => ({
          title: 'Services',
          ...getStackTabScreenOptions(route),
        })}
      />
      <PlankTab.Screen
        name={ROUTES.App.Edp}
        component={EdpStackNavigator}
        options={({ route }) => ({
          title: 'EDP',
          ...getStackTabScreenOptions(route),
        })}
      />
      <PlankTab.Screen
        name={ROUTES.App.Account}
        component={AccountStackNavigator}
        options={({ route }) => ({
          title: 'Account',
          ...getStackTabScreenOptions(route),
        })}
      />
    </PlankTab.Navigator>
  );
}
