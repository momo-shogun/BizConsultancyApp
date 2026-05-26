import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

import {
  CONSULTANT_WALLET_CANVAS,
  CONSULTANT_WALLET_LAYOUT,
} from '../constants/consultantWalletTheme';

const { screenPaddingH, screenPaddingTop, screenPaddingBottom, sectionGap, cardRadius, cardPadding } =
  CONSULTANT_WALLET_LAYOUT;

const CARD_BORDER = 'rgba(15, 23, 42, 0.07)';
const SLATE_MUTED = '#64748B';
const SLATE_LINE = '#E2E8F0';

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: { elevation: 3 },
  default: {},
});

export const consultantWalletStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CONSULTANT_WALLET_CANVAS,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: screenPaddingH,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: screenPaddingH,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom,
  },
  sectionLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '800',
    color: SLATE_MUTED,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[10],
    marginTop: THEME.spacing[20],
  },
  balanceCard: {
    borderRadius: cardRadius,
    padding: cardPadding,
    overflow: 'hidden',
    ...cardShadow,
  },
  balanceCardInner: {
    gap: THEME.spacing[16],
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  balanceTextBlock: {
    flex: 1,
    paddingRight: THEME.spacing[12],
    gap: THEME.spacing[4],
  },
  balanceLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  balanceLoader: {
    marginTop: THEME.spacing[8],
    alignSelf: 'flex-start',
  },
  balanceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  refreshBtnInline: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceHint: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  balancePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[4],
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  balancePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ECFDF5',
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[20],
    ...Platform.select({
      ios: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    ...cardShadow,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[14],
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
  },
  menuRowPressed: {
    backgroundColor: '#F8FAFC',
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  menuTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  menuSubtitle: {
    fontSize: THEME.typography.size[12],
    color: SLATE_MUTED,
    fontWeight: '500',
    lineHeight: 17,
  },
  menuChevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
    marginTop: sectionGap,
    padding: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: 'rgba(5,150,105,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.14)',
  },
  tipText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: '#047857',
    fontWeight: '500',
  },
  listSectionTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: '800',
    color: SLATE_MUTED,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[12],
    marginTop: THEME.spacing[20],
  },
  itemGap: {
    height: THEME.spacing[12],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[32],
    paddingHorizontal: THEME.spacing[24],
    gap: THEME.spacing[10],
    backgroundColor: THEME.colors.white,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginTop: THEME.spacing[8],
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[4],
  },
  emptyTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptyText: {
    fontSize: THEME.typography.size[14],
    color: SLATE_MUTED,
    textAlign: 'center',
    lineHeight: 21,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    gap: THEME.spacing[12],
  },
  retryBtn: {
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: THEME.typography.size[14],
  },
});
