import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StatusBar, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

export interface PlayerLayout {
  width: number;
  height: number;
}

export interface UseEdpOverviewVideoScreenResult {
  isLandscape: boolean;
  playerLayout: PlayerLayout;
  onPlayerLayout: (event: LayoutChangeEvent) => void;
}

export function useEdpOverviewVideoScreen(): UseEdpOverviewVideoScreenResult {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [playerLayout, setPlayerLayout] = useState<PlayerLayout>({
    width: windowWidth,
    height: windowHeight,
  });

  const isLandscape = windowWidth > windowHeight;

  const onPlayerLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) {
      return;
    }
    setPlayerLayout({ width, height });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const orientationTimer = setTimeout(() => {
        Orientation.lockToLandscape();
        StatusBar.setHidden(true, 'fade');
      }, 150);

      return () => {
        clearTimeout(orientationTimer);
        Orientation.lockToPortrait();
        StatusBar.setHidden(false, 'fade');
      };
    }, []),
  );

  return {
    isLandscape,
    playerLayout,
    onPlayerLayout,
  };
}
