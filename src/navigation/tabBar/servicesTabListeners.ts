import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { EventArg, ParamListBase } from '@react-navigation/native';

import { ROUTES } from '@/navigation/routeNames';
import type { AppTabParamList } from '@/navigation/types';

type ServicesTabNavigation = BottomTabNavigationProp<AppTabParamList, typeof ROUTES.App.Services>;

/**
 * Services tab keeps its nested stack when you leave the tab (e.g. Detail → Home → Services tab).
 * Tab press should always open the services list root — `ServicesListingScreen`
 * (`ROUTES.Services.List`) — not the last nested screen (Detail, Onboarding, etc.).
 */
export function servicesTabListeners({
  navigation,
}: {
  navigation: ServicesTabNavigation;
}): {
  tabPress: (event: EventArg<'tabPress', true>) => void;
} {
  return {
    tabPress: (event): void => {
      event.preventDefault();
      navigation.navigate(ROUTES.App.Services, {
        screen: ROUTES.Services.List,
      });
    },
  };
}

/** For navigators typed with a generic param list. */
export function servicesTabListenersForNavigation(
  navigation: BottomTabNavigationProp<ParamListBase>,
): ReturnType<typeof servicesTabListeners> {
  return servicesTabListeners({
    navigation: navigation as ServicesTabNavigation,
  });
}
