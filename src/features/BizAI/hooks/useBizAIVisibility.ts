import { useNavigationState } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { NavigationState, PartialState } from '@react-navigation/native';

import {
  BIZ_AI_HIDDEN_NESTED_ROUTES,
  BIZ_AI_VISIBLE_TAB_ROUTES,
} from '../constants/bizAiVisibility';

function findAppTabState(
  state: NavigationState | PartialState<NavigationState> | undefined,
): NavigationState | PartialState<NavigationState> | undefined {
  if (state == null) {
    return undefined;
  }
  const route = state.routes[state.index ?? 0];
  if (route.name.includes('App')) {
    return route.state;
  }
  for (const child of state.routes) {
    const nested = findAppTabState(child.state);
    if (nested != null) {
      return nested;
    }
  }
  return undefined;
}

export function isBizAIVisibleForTabRoute(
  tabRouteName: string,
  focusedNestedRoute: string | undefined,
): boolean {
  if (!BIZ_AI_VISIBLE_TAB_ROUTES.includes(tabRouteName)) {
    return false;
  }

  const hidden = BIZ_AI_HIDDEN_NESTED_ROUTES[tabRouteName];
  if (hidden == null || hidden.length === 0) {
    return true;
  }

  const focused = focusedNestedRoute ?? tabRouteName;
  return !hidden.includes(focused);
}

export function useBizAIVisibility(): boolean {
  return useNavigationState((state) => {
    if (state == null || state.routes.length === 0) {
      return false;
    }

    const activeRoute = state.routes[state.index ?? 0];

    if (BIZ_AI_VISIBLE_TAB_ROUTES.includes(activeRoute.name)) {
      const focusedNested = getFocusedRouteNameFromRoute(activeRoute);
      return isBizAIVisibleForTabRoute(activeRoute.name, focusedNested);
    }

    const tabState = findAppTabState(state);
    if (tabState == null || tabState.routes.length === 0) {
      return false;
    }

    const tabRoute = tabState.routes[tabState.index ?? 0];
    const focusedNested = getFocusedRouteNameFromRoute(tabRoute);
    return isBizAIVisibleForTabRoute(tabRoute.name, focusedNested);
  });
}
