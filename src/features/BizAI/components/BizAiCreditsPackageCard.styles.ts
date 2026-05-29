import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const SLATE_200 = '#E2E8F0';
const SLATE_500 = '#64748B';
const SLATE_900 = '#0F172A';
const AI_PURPLE = '#8B5CF6';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
});

export const packageCardStyles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_200,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  cardPopular: {
    borderColor: 'rgba(139, 92, 246, 0.45)',
    borderWidth: 1.5,
  },
  popularRibbon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: AI_PURPLE,
  },
  popularRibbonText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingRight: 72,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  packName: {
    fontSize: 17,
    fontWeight: '800',
    color: SLATE_900,
    letterSpacing: -0.3,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '600',
    color: AI_PURPLE,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SLATE_500,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: SLATE_900,
    letterSpacing: -0.5,
  },
  perCredit: {
    fontSize: 11,
    color: SLATE_500,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  walletBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
  },
  walletBtnDisabled: {
    opacity: 0.45,
  },
  walletBtnPressed: {
    opacity: 0.88,
  },
  walletBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: AI_PURPLE,
  },
  razorpayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    backgroundColor: SLATE_900,
  },
  razorpayBtnDisabled: {
    opacity: 0.55,
  },
  razorpayBtnPressed: {
    opacity: 0.9,
  },
  razorpayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insufficientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: 2,
  },
  insufficientText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#B45309',
    fontWeight: '500',
  },
});
