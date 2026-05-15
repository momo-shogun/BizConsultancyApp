import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

import type { ToastProps, ToastVariant } from './toast.types';
import {
  toastStyles as s,
  variantThemes,
  getVariantContainerStyle,
  getVariantTitleStyle,
  getVariantMessageStyle,
} from './toast.styles';

const ANIM_DURATION = 260;
const DEFAULT_DURATION = 3500;

function SuccessIcon({ color: _color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ErrorIcon({ color: _color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WarningIcon({ color: _color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 9v4M12 17h.01"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="#FFFFFF"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InfoIcon({ color: _color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke="#FFFFFF" strokeWidth={1.75} />
      <Path
        d="M12 16v-4M12 8h.01"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function AlertIcon({ color: _color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="#FFFFFF"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <Path
        d="M12 9v4M12 17h.01"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const ICON_MAP: Record<ToastVariant, React.FC<{ color: string }>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  alert: AlertIcon,
};

export function Toast({
  visible,
  variant = 'info',
  title,
  message,
  duration = DEFAULT_DURATION,
  action,
  dismissible = true,
  position = 'top',
  onDismiss,
  style,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(
    new Animated.Value(position === 'top' ? -30 : 30),
  ).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -30 : 30,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!visible) {
    return null;
  }

  const theme = variantThemes[variant];
  const IconComponent = ICON_MAP[variant];
  const topOffset = position === 'top' ? insets.top + 8 : undefined;

  return (
    <Animated.View
      style={[
        s.wrapper,
        position === 'top' ? s.wrapperTop : s.wrapperBottom,
        topOffset !== undefined ? { top: topOffset } : undefined,
        { opacity, transform: [{ translateY }] },
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={[s.container, getVariantContainerStyle(variant)]}>
        <View style={[s.iconCircle, { backgroundColor: theme.icon }]}>
          <IconComponent color={theme.icon} />
        </View>

        <View style={s.body}>
          {title ? (
            <Text
              style={[s.title, getVariantTitleStyle(variant)]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : null}
          <Text
            style={[s.message, getVariantMessageStyle(variant)]}
            numberOfLines={2}
          >
            {message}
          </Text>
          {action ? (
            <View style={s.actions}>
              <Pressable
                onPress={() => {
                  action.onPress();
                  handleDismiss();
                }}
                style={({ pressed }) => [
                  s.actionButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[s.actionText, { color: theme.actionText }]}>
                  {action.label}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {dismissible ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={handleDismiss}
            style={({ pressed }) => [s.closeButton, pressed && s.closePressed]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CloseIcon color={theme.message} />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}
