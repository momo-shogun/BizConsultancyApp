import React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

const SCROLL_FADE_START = 72;
const SCROLL_FADE_END = 130;

export interface ConsultantDetailImmersiveChromeProps {
  title: string;
  onBackPress: () => void;
  onCallPress?: () => void;
  onMessagePress?: () => void;
  showActions?: boolean;
  scrollY: Animated.Value;
}

export function ConsultantDetailImmersiveChrome(
  props: ConsultantDetailImmersiveChromeProps,
): React.ReactElement {
  const insets = useSafeAreaInsets();
  const showActions = props.showActions ?? false;
  const topInset = insets.top + THEME.spacing[8];

  const stickyOpacity = props.scrollY.interpolate({
    inputRange: [SCROLL_FADE_START, SCROLL_FADE_END],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const floatingOpacity = props.scrollY.interpolate({
    inputRange: [0, SCROLL_FADE_START, SCROLL_FADE_END],
    outputRange: [1, 0.35, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.floatingLayer,
          { top: topInset, opacity: floatingOpacity },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={props.onBackPress}
          hitSlop={8}
          style={({ pressed }) => [styles.glassFab, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={THEME.colors.white} />
        </Pressable>

        {showActions ? (
          <View style={styles.floatingActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Call consultant"
              onPress={props.onCallPress}
              hitSlop={8}
              style={({ pressed }) => [styles.glassFab, pressed && styles.pressed]}
            >
              <Ionicons name="call" size={18} color={THEME.colors.white} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Message on WhatsApp"
              onPress={props.onMessagePress}
              hitSlop={8}
              style={({ pressed }) => [styles.glassFab, pressed && styles.pressed]}
            >
              <Ionicons name="logo-whatsapp" size={19} color={THEME.colors.white} />
            </Pressable>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyBar,
          {
            paddingTop: insets.top,
            opacity: stickyOpacity,
          },
        ]}
      >
        <View pointerEvents="auto" style={styles.stickyInner}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={props.onBackPress}
            hitSlop={8}
            style={({ pressed }) => [styles.stickyBack, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={22} color={THEME.colors.textPrimary} />
          </Pressable>

          <Text style={styles.stickyTitle} numberOfLines={1}>
            {props.title}
          </Text>

          {showActions ? (
            <View style={styles.stickyActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Call consultant"
                onPress={props.onCallPress}
                hitSlop={8}
                style={({ pressed }) => [styles.stickyAction, pressed && styles.pressed]}
              >
                <Ionicons name="call-outline" size={19} color={THEME.colors.primary} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Message on WhatsApp"
                onPress={props.onMessagePress}
                hitSlop={8}
                style={({ pressed }) => [styles.stickyAction, pressed && styles.pressed]}
              >
                <Ionicons name="logo-whatsapp" size={19} color="#25D366" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.stickyActionSpacer} />
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  floatingLayer: {
    position: 'absolute',
    left: THEME.spacing[14],
    right: THEME.spacing[14],
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  glassFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
      default: {},
    }),
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 30,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 0,
      },
      default: {},
    }),
  },
  stickyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingRight: THEME.spacing[8],
  },
  stickyBack: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  stickyTitle: {
    flex: 1,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  stickyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  stickyActionSpacer: {
    width: THEME.spacing[8],
  },
  pressed: {
    opacity: 0.75,
  },
});
