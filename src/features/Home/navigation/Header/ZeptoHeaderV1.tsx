import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import bizLogo from '@/assets/lightlogo.png';
import { THEME } from '@/constants/theme';

import type { ZeptoHeaderV1Props } from './ZeptoHeaderV1.types';

const DEFAULT_FG = '#0A0A0A';
const DEFAULT_WALLET_ACCENT = '#6B21A8';
const DEFAULT_WALLET_PILL_BG = '#FFFFFF';

/** Match wallet pill `minHeight` so the mark aligns with that control (no pill chrome on the logo). */
const BRAND_MARK_HEIGHT = 36;
/** Horizontal bound for wide wordmarks; `contain` keeps aspect ratio. */
const BRAND_MARK_MAX_WIDTH = 168;

export function ZeptoHeaderV1(props: ZeptoHeaderV1Props): React.ReactElement {
  const {
    backgroundColor,
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
        <Image
          source={bizLogo}
          style={styles.brandMarkImage}
          resizeMode="contain"
          accessibilityLabel="Biz Consultancy"
        />
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

  const brandMark =
    slots.etaIcon ?? (
      <View style={styles.brandMarkWrap}>
        <Image
          source={bizLogo}
          style={styles.brandMarkImage}
          resizeMode="contain"
          accessibilityLabel="Biz Consultancy"
          accessibilityIgnoresInvertColors
        />
      </View>
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
        <View style={[styles.left, slots.left]}>{brandMark}</View>

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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  /** Flat container — no pill radius; optional shadow for separation from tinted header bg. */
  brandMarkWrap: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: BRAND_MARK_MAX_WIDTH + 4,
    paddingVertical: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      default: {
        elevation: 1,
        shadowColor: '#0f172a',
      },
    }),
  },
  brandMarkImage: {
    height: BRAND_MARK_HEIGHT,
    width: BRAND_MARK_MAX_WIDTH,
    alignSelf: 'flex-start',
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

