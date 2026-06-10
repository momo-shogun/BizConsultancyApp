import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AppTabParamList } from '../../types';
import { ROUTES } from '../../routeNames';
import { PlanckBridgedTabBar } from '../../shared/PlanckBridgedTabBar';
import { isTabBarHiddenFromOptions } from '../../tabBar/isTabBarHiddenFromOptions';
import { accountTabListeners } from '../../tabBar/accountTabListeners';
import { servicesTabListeners } from '../../tabBar/servicesTabListeners';
import { getStackTabScreenOptions } from '../../tabBar/tabBarVisibility';

import { selectEffectiveAccountRole } from '@/features/Auth/store/authSelectors';
import { HomeDashboardScreen } from '@/features/Home/screens/HomeDashboardScreen';
import { useAppSelector } from '@/store/typedHooks';

import { AccountTabHost } from '../../account/AccountTabHost';
import { ServicesStackNavigator } from '../../ServicesStackNavigator';
import { plankBarV1TabNavigatorScreenOptions } from './plankBarV1.styles';
import { EdpStackNavigator } from '../../EdpStackNavigator';
import { BizAITabOverlay } from '@/features/BizAI/providers/BizAITabOverlay';

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
  const accountRole = useAppSelector(selectEffectiveAccountRole);
  const showEdpTab = accountRole !== 'consultant';

  return (
    <BizAITabOverlay>
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
        listeners={servicesTabListeners}
        options={({ route }) => ({
          title: 'Services',
          ...getStackTabScreenOptions(route),
        })}
      />
      {showEdpTab ? (
        <PlankTab.Screen
          name={ROUTES.App.Edp}
          component={EdpStackNavigator}
          options={({ route }) => ({
            title: 'EDP',
            ...getStackTabScreenOptions(route),
          })}
        />
      ) : null}
      <PlankTab.Screen
        name={ROUTES.App.Account}
        component={AccountTabHost}
        listeners={accountTabListeners}
        options={({ route }) => ({
          title: 'Account',
          ...getStackTabScreenOptions(route),
        })}
      />
    </PlankTab.Navigator>
    </BizAITabOverlay>
  );
}
