import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type DimensionValue,
  type ViewStyle,
} from 'react-native';

import { THEME } from '@/constants/theme';

export type ContentPlaceholderVariant = 'line' | 'block' | 'circle' | 'consultant-card';

export interface ContentPlaceholderProps {
  variant?: ContentPlaceholderVariant;
  width?: DimensionValue;
  height?: DimensionValue;
  /** Used when `variant` is `consultant-card`. */
  cardWidth?: number;
  style?: ViewStyle;
  testID?: string;
}

const SHIMMER_BASE = '#E2E8F0';
const SHIMMER_HIGHLIGHT = '#F1F5F9';

function resolveCardHeight(width: number): number {
  return Math.round(width * 1.52);
}

function ShimmerBlock(props: {
  style: ViewStyle | ViewStyle[];
  testID?: string;
}): React.ReactElement {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      testID={props.testID}
      style={[styles.shimmer, { opacity }, props.style]}
    />
  );
}

function ConsultantCardPlaceholder(props: { cardWidth: number }): React.ReactElement {
  const cardHeight = resolveCardHeight(props.cardWidth);
  const panelHeight = Math.round(cardHeight * 0.42);
  const photoHeight = cardHeight - panelHeight;

  return (
    <View style={[styles.consultantCard, { width: props.cardWidth, height: cardHeight }]}>
      <ShimmerBlock style={[styles.consultantPhoto, { height: photoHeight }]} />
      <View style={[styles.consultantPanel, { height: panelHeight }]}>
        <ShimmerBlock style={styles.consultantLineLg} />
        <ShimmerBlock style={[styles.consultantLineMd, { width: '72%' }]} />
        <ShimmerBlock style={[styles.consultantLineSm, { width: '90%' }]} />
        <ShimmerBlock style={styles.consultantBtn} />
      </View>
    </View>
  );
}

/**
 * Reusable loading skeleton. Use `consultant-card` on list grids; `line` / `block` elsewhere.
 */
export function ContentPlaceholder({
  variant = 'block',
  width = '100%',
  height,
  cardWidth = 192,
  style,
  testID,
}: ContentPlaceholderProps): React.ReactElement {
  if (variant === 'consultant-card') {
    return (
      <View style={style} testID={testID}>
        <ConsultantCardPlaceholder cardWidth={cardWidth} />
      </View>
    );
  }

  if (variant === 'circle') {
    const size = typeof width === 'number' ? width : 48;
    return (
      <ShimmerBlock
        testID={testID}
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      />
    );
  }

  const resolvedHeight =
    height ?? (variant === 'line' ? 12 : typeof width === 'number' ? width : 80);

  return (
    <ShimmerBlock
      testID={testID}
      style={[
        variant === 'line' ? styles.line : styles.block,
        { width, height: resolvedHeight },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: SHIMMER_BASE,
    borderRadius: THEME.radius[8],
    overflow: 'hidden',
  },
  line: {
    borderRadius: THEME.radius[6],
  },
  block: {
    borderRadius: THEME.radius[12],
  },
  circle: {
    backgroundColor: SHIMMER_HIGHLIGHT,
  },
  consultantCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
  },
  consultantPhoto: {
    width: '100%',
    borderRadius: 0,
  },
  consultantPanel: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[10],
    gap: THEME.spacing[8],
    backgroundColor: SHIMMER_HIGHLIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },
  consultantLineLg: {
    height: 14,
    width: '85%',
    borderRadius: THEME.radius[6],
  },
  consultantLineMd: {
    height: 12,
    borderRadius: THEME.radius[6],
  },
  consultantLineSm: {
    height: 10,
    borderRadius: THEME.radius[6],
  },
  consultantBtn: {
    marginTop: THEME.spacing[4],
    height: 34,
    width: '55%',
    borderRadius: THEME.radius[12],
  },
});
