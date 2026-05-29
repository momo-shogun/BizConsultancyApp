import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { EventArg, ParamListBase } from '@react-navigation/native';

import { ROUTES } from '@/navigation/routeNames';
import type { AppTabParamList } from '@/navigation/types';

type AccountTabNavigation = BottomTabNavigationProp<AppTabParamList, typeof ROUTES.App.Account>;

/**
 * Account tab keeps its nested stack when you leave the tab (e.g. Home → Membership → Home tab).
 * Tab press should always open the profile root — `UserProfileScreen` or `ConsultantProfileScreen`
 * (`ROUTES.Account.Home`) — not the last nested screen (Membership, Wallet, Settings, etc.).
 */
export function accountTabListeners({
  navigation,
}: {
  navigation: AccountTabNavigation;
}): {
  tabPress: (event: EventArg<'tabPress', true>) => void;
} {
  return {
    tabPress: (event): void => {
      event.preventDefault();
      navigation.navigate(ROUTES.App.Account, {
        screen: ROUTES.Account.Home,
      });
    },
  };
}

/** For navigators typed with a generic param list. */
export function accountTabListenersForNavigation(
  navigation: BottomTabNavigationProp<ParamListBase>,
): ReturnType<typeof accountTabListeners> {
  return accountTabListeners({
    navigation: navigation as AccountTabNavigation,
  });
}
