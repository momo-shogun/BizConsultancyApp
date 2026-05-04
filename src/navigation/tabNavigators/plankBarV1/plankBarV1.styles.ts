import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

/** Same base blue as `PlanckBridgedTabBar` so no default gray tab strip shows through. */
export const PLANK_BAR_V1_BLUE = '#2F6FED';

/**
 * Shared screen options for the Plank Bar V1 tab navigator.
 * Add tab-bar–specific StyleSheets or token-based constants here as the preset grows.
 */
export const plankBarV1TabNavigatorScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: PLANK_BAR_V1_BLUE,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
};
