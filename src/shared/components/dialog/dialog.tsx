import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { DialogAction, DialogProps, DialogVariant } from './dialog.types';
import { dialogStyles as s, variantThemes } from './dialog.styles';

const ANIM_DURATION = 200;

function DefaultIcon({ variant }: { variant: DialogVariant }) {
  const color = variantThemes[variant].iconColor;

  if (variant === 'success') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 6L9 17l-5-5"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (variant === 'destructive') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.75} />
        <Path
          d="M15 9l-6 6M9 9l6 6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (variant === 'warning') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke={color}
          strokeWidth={1.75}
          strokeLinejoin="round"
        />
        <Path
          d="M12 9v4M12 17h.01"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.75} />
      <Path
        d="M12 16v-4M12 8h.01"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CloseIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const ACTION_STYLE_MAP = {
  default: s.actionDefault,
  outline: s.actionOutline,
  destructive: s.actionDestructive,
  ghost: s.actionGhost,
} as const;

const ACTION_TEXT_MAP = {
  default: s.actionTextDefault,
  outline: s.actionTextOutline,
  destructive: s.actionTextDestructive,
  ghost: s.actionTextGhost,
} as const;

function ActionButton({ action }: { action: DialogAction }) {
  const v = action.variant ?? 'default';

  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [
        s.actionButton,
        ACTION_STYLE_MAP[v],
        pressed && s.actionPressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={[s.actionText, ACTION_TEXT_MAP[v]]}>{action.label}</Text>
    </Pressable>
  );
}

export function Dialog({
  visible,
  onClose,
  variant = 'default',
  title,
  description,
  icon,
  actions,
  dismissible = true,
  closeOnBackdrop = true,
  children,
  style,
  contentStyle,
}: DialogProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.92);
    }
  }, [visible, opacity, scale]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop && dismissible) {
      onClose();
    }
  };

  const theme = variantThemes[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Animated.View style={[s.backdrop, { opacity }]}>
        <Pressable style={s.backdrop} onPress={handleBackdropPress}>
          <Animated.View
            style={[s.container, { transform: [{ scale }] }, style]}
          >
            <Pressable>
              {dismissible && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close dialog"
                  onPress={onClose}
                  style={({ pressed }) => [
                    s.closeButton,
                    pressed && s.closePressed,
                  ]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CloseIcon />
                </Pressable>
              )}

              <View style={[s.content, contentStyle]}>
                {icon ?? (
                  <View
                    style={[s.iconCircle, { backgroundColor: theme.iconBg }]}
                  >
                    <DefaultIcon variant={variant} />
                  </View>
                )}

                {(title || description) && (
                  <View style={s.textGroup}>
                    {title ? (
                      <Text
                        style={[s.title, { color: theme.titleColor }]}
                        accessibilityRole="header"
                      >
                        {title}
                      </Text>
                    ) : null}
                    {description ? (
                      <Text style={s.description}>{description}</Text>
                    ) : null}
                  </View>
                )}

                {children ? (
                  <View style={s.childrenWrap}>{children}</View>
                ) : null}
              </View>

              {actions && actions.length > 0 && (
                <View style={actions.length > 2 ? s.footerStacked : s.footer}>
                  {actions.map((action, i) => (
                    <ActionButton key={`action-${i}`} action={action} />
                  ))}
                </View>
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
