import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { Edge } from 'react-native-safe-area-context';

/** True when the screen sits inside the main bottom tab navigator (tab bar visible). */
export function useIsTabHostedScreen(): boolean {
  return useBottomTabBarHeight() > 0;
}

/** Bottom tab bar height; `0` on root-stack / modal screens without a tab bar. */
export function useTabBarOverlayHeight(): number {
  return useBottomTabBarHeight();
}

/**
 * Default safe-area edges for {@link AccountHubScreenShell}.
 * Tab-hosted screens skip bottom inset (tab bar already occupies that space).
 */
export function useAccountHubShellEdges(
  hasGradientHeader: boolean,
  explicitEdges?: Edge[],
): Edge[] {
  const tabHosted = useIsTabHostedScreen();

  if (explicitEdges != null) {
    return explicitEdges;
  }

  if (tabHosted) {
    return hasGradientHeader ? [] : ['top'];
  }

  return hasGradientHeader ? ['bottom'] : ['top', 'bottom'];
}

/**
 * Default safe-area edges for profile chrome on the account tab root.
 */
export function useProfileChromeEdges(explicitEdges?: Edge[]): Edge[] {
  if (explicitEdges != null) {
    return explicitEdges;
  }
  return useIsTabHostedScreen() ? [] : ['bottom'];
}
