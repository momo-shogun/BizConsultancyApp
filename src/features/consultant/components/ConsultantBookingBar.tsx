import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

export interface ConsultantBookingBarProps {
  priceLabel: string;
  metaLabel?: string | null;
  ctaLabel?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ConsultantBookingBar(props: ConsultantBookingBarProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const ctaLabel = props.ctaLabel ?? 'Book now';
  const disabled = props.disabled ?? false;

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, THEME.spacing[12]),
        },
      ]}
    >
      <View style={styles.left}>
        <Text style={styles.priceCaption}>Consultation from</Text>
        <Text style={styles.priceValue} numberOfLines={1}>
          {props.priceLabel}
        </Text>
        {props.metaLabel != null && props.metaLabel.trim().length > 0 ? (
          <Text style={styles.priceMeta} numberOfLines={1}>
            {props.metaLabel}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
        onPress={props.onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.ctaWrap,
          disabled ? styles.ctaDisabled : null,
          pressed && !disabled ? styles.ctaPressed : null,
        ]}
      >
        <LinearGradient
          colors={disabled ? ['#94A3B8', '#64748B'] : [THEME.colors.primary, '#0D9488', '#0F5132']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
          <Ionicons name="arrow-forward" size={18} color={THEME.colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,81,50,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B3D2C',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  left: {
    flex: 1,
    minWidth: 0,
    marginRight: THEME.spacing[12],
  },
  priceCaption: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: THEME.typography.size[24],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  priceMeta: {
    marginTop: 2,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
  },
  ctaWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    minWidth: 148,
  },
  ctaDisabled: {
    opacity: 0.72,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    minHeight: 52,
    paddingHorizontal: THEME.spacing[20],
  },
  ctaText: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: 0.1,
  },
});
