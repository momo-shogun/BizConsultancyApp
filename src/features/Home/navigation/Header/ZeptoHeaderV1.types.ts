import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface ZeptoHeaderV1Slots {
  root?: ViewStyle;
  left?: ViewStyle;
  right?: ViewStyle;
  etaIcon?: ReactNode;
  addressTrailingIcon?: ReactNode;
  walletIcon?: ReactNode;
  profileIcon?: ReactNode;
}

export interface ZeptoHeaderV1Props {
  backgroundColor: string;
  etaLabel: string;
  addressLabel: string;
  walletLabel: string;
  onAddressPress?: () => void;
  onWalletPress?: () => void;
  onProfilePress?: () => void;
  foregroundColor?: string;
  walletAccentColor?: string;
  walletPillBackgroundColor?: string;
  unstyled?: boolean;
  slots?: ZeptoHeaderV1Slots;
  testID?: string;
}

