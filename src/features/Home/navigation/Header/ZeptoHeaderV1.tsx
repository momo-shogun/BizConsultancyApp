import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

import type { ZeptoHeaderV1Props } from './ZeptoHeaderV1.types';

const DEFAULT_FG = '#0A0A0A';
const DEFAULT_WALLET_ACCENT = '#6B21A8';
const DEFAULT_WALLET_PILL_BG = '#FFFFFF';

export function ZeptoHeaderV1(props: ZeptoHeaderV1Props): React.ReactElement {
  const {
    backgroundColor,
    etaLabel,
    addressLabel,
    walletLabel,
    onAddressPress,
    onWalletPress,
    onProfilePress,
    foregroundColor = DEFAULT_FG,
    walletAccentColor = DEFAULT_WALLET_ACCENT,
    walletPillBackgroundColor = DEFAULT_WALLET_PILL_BG,
    unstyled = false,
    slots = {},
    testID,
  } = props;

  if (unstyled) {
    return (
      <View testID={testID} accessibilityLabel="Zepto style header">
        <Text>{etaLabel}</Text>
        {/* <Text>{addressLabel}</Text> */}
        <Pressable accessibilityRole="button" onPress={onWalletPress}>
          <Text>{walletLabel}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onProfilePress}>
          <View />
        </Pressable>
      </View>
    );
  }

  const etaIcon = slots.etaIcon ?? <Ionicons name="business-outline" color={foregroundColor} size={18} />;
  const addressTrail =
    slots.addressTrailingIcon ?? (
      <Ionicons name="chevron-down" color={foregroundColor} size={14} />
    );
  const walletGlyph =
    slots.walletIcon ?? (
      <Ionicons name="wallet-outline" color={walletAccentColor} size={18} />
    );
  const profileGlyph =
    slots.profileIcon ?? (
      <Ionicons name="person-circle-outline" color={foregroundColor} size={26} />
    );

  return (
    <View style={[styles.root, { backgroundColor }, slots.root]} testID={testID}>
      <View style={styles.row}>
        <View style={[styles.left, slots.left]}>
          <View style={styles.etaRow}>
            {etaIcon}
            <Text style={[styles.etaText, { color: foregroundColor }]} numberOfLines={1}>
              {etaLabel}
            </Text>
          </View>

          {/* {onAddressPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delivery address"
              onPress={onAddressPress}
              style={styles.addressRow}
            >
              <Text
                style={[styles.addressText, { color: foregroundColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {addressLabel}
              </Text>
              {addressTrail}
            </Pressable>
          ) : (
            <View style={styles.addressRow}>
              <Text
                style={[styles.addressText, { color: foregroundColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {addressLabel}
              </Text>
              {addressTrail}
            </View>
          )} */}
          <View style={styles.addressRow}>
            <Text style={[styles.addressText, { color: foregroundColor }]} numberOfLines={1} ellipsizeMode="tail">Welcome to Biz Consultancy</Text>
          </View>
        </View>

        <View style={[styles.right, slots.right]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Wallet ${walletLabel}`}
            onPress={onWalletPress}
            style={({ pressed }) => [
              styles.walletPill,
              { backgroundColor: walletPillBackgroundColor },
              pressed ? styles.pressed : null,
            ]}
            hitSlop={8}
          >
            <View style={styles.walletRow}>
              {walletGlyph}
              <Text style={[styles.walletAmount, { color: walletAccentColor }]}>{walletLabel}</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onProfilePress}
            style={({ pressed }) => [styles.profileBtn, pressed ? styles.pressed : null]}
            hitSlop={8}
          >
            {profileGlyph}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    gap: THEME.spacing[12],
  },
  left: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  etaText: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: -0.2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    minWidth: 0,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
    letterSpacing: -0.1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  walletPill: {
    minHeight: 36,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  walletAmount: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: -0.2,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});

