import type { NavigationContainerRefWithCurrent, ParamListBase } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

export interface RouteTrackingHandlers {
  onReady: () => void;
  onStateChange: () => void;
}

export function useRouteTracking(
  navigationRef: NavigationContainerRefWithCurrent<ParamListBase>,
): RouteTrackingHandlers {
  const lastRouteNameRef = useRef<string | undefined>(undefined);

  const getCurrentRouteName = useCallback((): string | undefined => {
    const route = navigationRef.current?.getCurrentRoute();
    return route?.name;
  }, [navigationRef]);

  const trackIfChanged = useCallback((): void => {
    const current = getCurrentRouteName();
    if (!current) return;
    if (lastRouteNameRef.current === current) return;

    lastRouteNameRef.current = current;

    // Placeholder analytics hook point:
    // Replace with Segment/Firebase/Datadog/etc.
    // eslint-disable-next-line no-console
    console.log('[nav] route:', current);
  }, [getCurrentRouteName]);

  return {
    onReady: trackIfChanged,
    onStateChange: trackIfChanged,
  };
}

