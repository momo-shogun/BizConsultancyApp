import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { Route } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { ROUTES } from '../routeNames';
import { plankBarV1TabNavigatorScreenOptions } from '../tabNavigators/plankBarV1/plankBarV1.styles';

/**
 * Tab route name → nested stack routes where the bottom tab bar should be hidden.
 * Add route names here to hide the bar on more screens.
 */
export const TAB_BAR_HIDDEN_ROUTES: Readonly<Record<string, readonly string[]>> = {
  [ROUTES.App.Edp]: [ROUTES.Edp.Modules],
  [ROUTES.App.Services]: [ROUTES.Services.Detail, ROUTES.Services.Onboarding],
  [ROUTES.App.Account]: [
    ROUTES.Account.HelpSettings,
    ROUTES.Account.Membership,
    ROUTES.Account.EditProfile,
    ROUTES.Account.ConsultantBankDetailsScreen,
    ROUTES.Account.ExpertVideosScreen,
    ROUTES.Account.CreditsScreen,
    ROUTES.Account.ConsultantWallet,
    ROUTES.Account.ConsultantWithdrawals,
    ROUTES.Account.TransactionHis,
    ROUTES.Account.userGuide,
    ROUTES.Account.userCallHis,
    ROUTES.Account.addReview,
    ROUTES.Account.MyServices,
    ROUTES.Account.ApplyService,
    ROUTES.Account.MyDiagnosticPack,
    ROUTES.Account.MyBookings,
    ROUTES.Account.WorkshopBookings,
    ROUTES.Account.MyEdp,
  ],
  // [ROUTES.App.Account]:[ROUTES.Account.Membership]
} as const;

export function isTabBarVisibleForRoute(route: Route<string> | undefined): boolean {
  if (route == null) {
    return true;
  }

  const hiddenRoutes = TAB_BAR_HIDDEN_ROUTES[route.name];
  if (hiddenRoutes == null || hiddenRoutes.length === 0) {
    return true;
  }

  const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? route.name;
  return !hiddenRoutes.includes(focusedRouteName);
}

export function getStackTabScreenOptions(route: Route<string>): BottomTabNavigationOptions {
  if (isTabBarVisibleForRoute(route)) {
    return {
      tabBarStyle: plankBarV1TabNavigatorScreenOptions.tabBarStyle,
    };
  }

  return {
    tabBarStyle: { display: 'none' },
  };
}
