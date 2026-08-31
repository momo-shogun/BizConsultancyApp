import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { ACCOUNT_SUBSCREEN_HEADER_COLOR } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader/ScreenHeader';
import { SafeAreaWrapper } from '@/shared/components/wrappers/SafeAreaWrapper';

export type AccountHubScreenShellProps = {
  title: string;
  onBackPress?: () => void;
  canvasColor: string;
  edges?: Edge[];
  /** Solid header + status bar; defaults to account hub slate */
  headerColor?: string;
  /** Gradient header band; status bar uses the first stop */
  headerGradientColors?: readonly [string, string, ...string[]];
  headerBandStyle?: StyleProp<ViewStyle>;
  onSearchPress?: () => void;
  headerRightAction?: React.ReactNode;
  /** Rendered inside the header band (e.g. animated search) — same gradient as title row */
  headerAccessory?: React.ReactNode;
  children: React.ReactNode;
};

export function AccountHubScreenShell(props: AccountHubScreenShellProps): React.ReactElement {
  const solidHeaderColor = props.headerColor ?? ACCOUNT_SUBSCREEN_HEADER_COLOR;
  const gradientColors = props.headerGradientColors;
  const hasGradientHeader = gradientColors != null && gradientColors.length >= 2;
  const statusBarColor =
    gradientColors != null && gradientColors.length > 0
      ? gradientColors[0]
      : solidHeaderColor;
  const screenHeaderColor = hasGradientHeader ? 'transparent' : solidHeaderColor;
  const safeAreaEdges: Edge[] =
    props.edges ?? (hasGradientHeader ? ['bottom'] : ['top', 'bottom']);
  const appliesTopInsetOutside = safeAreaEdges.includes('top');

  const headerChrome = (
    <ScreenHeader
      title={props.title}
      onBackPress={props.onBackPress}
      headerColor={screenHeaderColor}
      onSearchPress={props.onSearchPress}
      rightAction={props.headerRightAction}
    />
  );

  const headerContent = (
    <>
      {headerChrome}
      {props.headerAccessory != null ? (
        <View style={styles.headerAccessory}>{props.headerAccessory}</View>
      ) : null}
    </>
  );

  // Gradient headers extend under the status bar; inset chrome inside the band
  // (padding on LinearGradient itself is unreliable on iOS).
  const headerBandInner = appliesTopInsetOutside ? (
    headerContent
  ) : (
    <SafeAreaView edges={['top']} style={styles.headerSafeTop}>
      {headerContent}
    </SafeAreaView>
  );

  return (
    <SafeAreaWrapper
      edges={safeAreaEdges}
      bgColor={statusBarColor}
      contentBgColor={props.canvasColor}
      statusBarStyle="light-content"
    >
      {hasGradientHeader ? (
        <LinearGradient
          colors={[...gradientColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerBand, props.headerBandStyle]}
        >
          {headerBandInner}
        </LinearGradient>
      ) : (
        <View style={[styles.headerBand, { backgroundColor: solidHeaderColor }, props.headerBandStyle]}>
          {headerBandInner}
        </View>
      )}
      {props.children}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  headerBand: {
    backgroundColor: ACCOUNT_SUBSCREEN_HEADER_COLOR,
  },
  headerSafeTop: {
    width: '100%',
  },
  headerAccessory: {
    paddingBottom: THEME.spacing[4],
  },
});
