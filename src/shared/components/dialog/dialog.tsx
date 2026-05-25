import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { DialogAction, DialogProps, DialogVariant } from './dialog.types';
import { dialogStyles as s, variantThemes } from './dialog.styles';

const ANIM_DURATION = 200;

const VARIANT_ICON: Record<
  DialogVariant,
  React.ComponentProps<typeof Ionicons>['name']
> = {
  success: 'checkmark-circle',
  destructive: 'close-circle',
  warning: 'warning',
  default: 'information-circle',
};

function DefaultIcon({ variant }: { variant: DialogVariant }): React.ReactElement {
  const color = variantThemes[variant].iconColor;
  return <Ionicons name={VARIANT_ICON[variant]} size={24} color={color} />;
}

function CloseIcon(): React.ReactElement {
  return <Ionicons name="close" size={18} color="#94A3B8" />;
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

function ActionButton({ action }: { action: DialogAction }): React.ReactElement {
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
}: DialogProps): React.ReactElement {
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.92);
      Animated.spring(scale, {
        toValue: 1,
        damping: 20,
        stiffness: 300,
        useNativeDriver: true,
      }).start();
    } else {
      scale.setValue(0.92);
    }
  }, [visible, scale]);

  const handleBackdropPress = (): void => {
    if (closeOnBackdrop && dismissible) {
      onClose();
    }
  };

  const theme = variantThemes[variant];

  const containerStyle: ViewStyle[] = [s.container, { transform: [{ scale }] }];
  if (style != null) {
    containerStyle.push(style);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Pressable style={s.overlay} onPress={handleBackdropPress}>
        <Animated.View style={containerStyle}>
          <Pressable onPress={() => undefined} style={s.dialogSurface}>
              {dismissible ? (
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
              ) : null}

              <View style={[s.content, contentStyle]}>
                {icon ?? (
                  <View
                    style={[s.iconCircle, { backgroundColor: theme.iconBg }]}
                  >
                    <DefaultIcon variant={variant} />
                  </View>
                )}

                {title != null || description != null ? (
                  <View style={s.textGroup}>
                    {title != null ? (
                      <Text
                        style={[s.title, { color: theme.titleColor }]}
                        accessibilityRole="header"
                      >
                        {title}
                      </Text>
                    ) : null}
                    {description != null ? (
                      <Text style={s.description}>{description}</Text>
                    ) : null}
                  </View>
                ) : null}

                {children != null ? (
                  <View style={s.childrenWrap}>{children}</View>
                ) : null}
              </View>

              {actions != null && actions.length > 0 ? (
                <View style={actions.length > 2 ? s.footerStacked : s.footer}>
                  {actions.map((action, i) => (
                    <ActionButton key={`action-${i}`} action={action} />
                  ))}
                </View>
              ) : null}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
