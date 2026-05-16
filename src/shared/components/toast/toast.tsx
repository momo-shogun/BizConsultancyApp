import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const ICON_MAP: Record<ToastVariant, React.ComponentProps<typeof Ionicons>['name']> = {
  success: 'checkmark',
  error: 'close',
  warning: 'warning',
  info: 'information-circle',
  alert: 'alert',
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

  const handleDismiss = (): void => {
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
  }, [visible, duration]);

  if (!visible) {
    return null;
  }

  const theme = variantThemes[variant];
  const iconName = ICON_MAP[variant];
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
          <Ionicons name={iconName} size={20} color="#FFFFFF" />
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
            <Ionicons name="close" size={16} color={theme.message} />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}
