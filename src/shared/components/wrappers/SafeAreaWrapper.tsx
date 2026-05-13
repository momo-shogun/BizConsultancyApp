import React from 'react';
import { StyleSheet, View,StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

type Props = SafeAreaViewProps & {
  bgColor?: string;
  contentBgColor?: string;
  isLight ?: boolean ;
};

export function SafeAreaWrapper({
  bgColor,
  contentBgColor,
  isLight=false,
  style,
  children,
  ...props
}: Props): React.ReactElement {
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: bgColor ?? THEME.colors.background,
    },
    content: {
      flex: 1,
      backgroundColor: contentBgColor ?? THEME.colors.background,
    },
  });

  return (
    <SafeAreaProvider>
   {isLight ? <StatusBar barStyle="light-content" /> : <StatusBar barStyle="dark-content"  />}
    
    <SafeAreaView {...props} style={[styles.safeArea, style]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}