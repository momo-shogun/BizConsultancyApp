import React, { useCallback } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

export type StatusBarIconStyle = 'light-content' | 'dark-content';

type Props = SafeAreaViewProps & {
  bgColor?: string;
  contentBgColor?: string;
  /** @deprecated Use statusBarStyle. true = white icons (dark backgrounds). */
  isLight?: boolean;
  /** Status bar icon color. Defaults to dark icons on light screens. */
  statusBarStyle?: StatusBarIconStyle;
};

function resolveStatusBarStyle(
  isLight: boolean,
  statusBarStyle?: StatusBarIconStyle,
): StatusBarIconStyle {
  if (statusBarStyle != null) {
    return statusBarStyle;
  }
  return isLight ? 'light-content' : 'dark-content';
}

export function SafeAreaWrapper({
  bgColor,
  contentBgColor,
  isLight = false,
  statusBarStyle,
  style,
  children,
  ...props
}: Props): React.ReactElement {
  const backgroundColor = bgColor ?? THEME.colors.background;
  const barStyle = resolveStatusBarStyle(isLight, statusBarStyle);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle, true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(backgroundColor, true);
        StatusBar.setTranslucent(false);
      }
    }, [barStyle, backgroundColor]),
  );

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} translucent={false} />
      <SafeAreaView {...props} style={[styles.safeArea, { backgroundColor }, style]}>
        <View style={[styles.content, { backgroundColor: contentBgColor ?? backgroundColor }]}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
