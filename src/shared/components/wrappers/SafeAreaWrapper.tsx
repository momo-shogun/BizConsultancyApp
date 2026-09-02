import React, { useCallback, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

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

function applyStatusBarAppearance(barStyle: StatusBarIconStyle, backgroundColor: string): void {
  StatusBar.setBarStyle(barStyle, true);
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(backgroundColor, true);
    StatusBar.setTranslucent(false);
  }
}

function normalizeEdges(value: Props['edges']): Edge[] {
  if (value == null) {
    return ['top', 'bottom'];
  }
  if (Array.isArray(value)) {
    return [...value];
  }
  const objectEdges = value as Partial<Record<Edge, unknown>>;
  const resolved: Edge[] = [];
  if (objectEdges.top != null) {
    resolved.push('top');
  }
  if (objectEdges.bottom != null) {
    resolved.push('bottom');
  }
  if (objectEdges.left != null) {
    resolved.push('left');
  }
  if (objectEdges.right != null) {
    resolved.push('right');
  }
  return resolved.length > 0 ? resolved : ['top', 'bottom'];
}

interface SplitInsetLayoutProps {
  edges: Edge[];
  backgroundColor: string;
  canvasColor: string;
  style: Props['style'];
  children: React.ReactNode;
}

function SplitInsetLayout(props: SplitInsetLayoutProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const edgeSet = new Set(props.edges);
  const topInset = edgeSet.has('top') ? insets.top : 0;
  const bottomInset = edgeSet.has('bottom') ? insets.bottom : 0;
  const leftInset = edgeSet.has('left') ? insets.left : 0;
  const rightInset = edgeSet.has('right') ? insets.right : 0;

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: props.canvasColor,
          paddingLeft: leftInset,
          paddingRight: rightInset,
        },
        props.style,
      ]}
    >
      {topInset > 0 ? (
        <View style={{ height: topInset, backgroundColor: props.backgroundColor }} />
      ) : null}
      <View style={[styles.content, { backgroundColor: props.canvasColor }]}>
        {props.children}
      </View>
      {bottomInset > 0 ? (
        <View style={{ height: bottomInset, backgroundColor: props.canvasColor }} />
      ) : null}
    </View>
  );
}

export function SafeAreaWrapper({
  bgColor,
  contentBgColor,
  isLight = false,
  statusBarStyle,
  style,
  children,
  edges = ['top', 'bottom'],
  ...props
}: Props): React.ReactElement {
  const backgroundColor = bgColor ?? THEME.colors.background;
  const canvasColor = contentBgColor ?? backgroundColor;
  const barStyle = resolveStatusBarStyle(isLight, statusBarStyle);
  const useSplitInsets = canvasColor !== backgroundColor;
  const resolvedEdges = normalizeEdges(edges);

  useEffect(() => {
    applyStatusBarAppearance(barStyle, backgroundColor);
  }, [barStyle, backgroundColor]);

  useFocusEffect(
    useCallback(() => {
      applyStatusBarAppearance(barStyle, backgroundColor);
    }, [barStyle, backgroundColor]),
  );

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} translucent={false} />
      {useSplitInsets ? (
        <SplitInsetLayout
          edges={resolvedEdges}
          backgroundColor={backgroundColor}
          canvasColor={canvasColor}
          style={style}
        >
          {children}
        </SplitInsetLayout>
      ) : (
        <SafeAreaView {...props} edges={edges} style={[styles.safeArea, { backgroundColor }, style]}>
          <View style={[styles.content, { backgroundColor: canvasColor }]}>
            {children}
          </View>
        </SafeAreaView>
      )}
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
