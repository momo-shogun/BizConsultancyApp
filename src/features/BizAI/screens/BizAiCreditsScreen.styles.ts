import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

/** Matches hero gradient top — status bar + ScreenHeader */
export const BIZ_AI_CREDITS_HEADER_COLOR = '#0F172A';

const SLATE_50 = '#F8FAFC';
const SLATE_100 = '#F1F5F9';
const SLATE_200 = '#E2E8F0';
const SLATE_500 = '#64748B';
const SLATE_700 = '#334155';
const SLATE_900 = '#0F172A';

const AI_PURPLE = '#8B5CF6';
const AI_PURPLE_SOFT = 'rgba(139, 92, 246, 0.12)';
const EMERALD = '#059669';
const EMERALD_SOFT = 'rgba(5, 150, 105, 0.1)';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: SLATE_900,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
  default: {},
});

export const bizAiCreditsScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SLATE_100,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerBand: {
    backgroundColor: BIZ_AI_CREDITS_HEADER_COLOR,
  },
  heroWrap: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 4,
    backgroundColor: BIZ_AI_CREDITS_HEADER_COLOR,
  },
  heroGradient: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 52,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
  },
  heroGlowSecondary: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.72)',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  refreshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  refreshPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  balanceBlock: {
    gap: 4,
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  balanceValue: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  balanceUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  balanceHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 18,
  },
  walletFloatCard: {
    marginHorizontal: 16,
    marginTop: -36,
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_200,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...CARD_SHADOW,
  },
  walletIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AI_PURPLE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  walletLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SLATE_500,
  },
  walletAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: SLATE_900,
    letterSpacing: -0.3,
  },
  topUpBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: EMERALD_SOFT,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  topUpBtnPressed: {
    opacity: 0.88,
  },
  topUpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: EMERALD,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: SLATE_900,
    letterSpacing: -0.35,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: SLATE_500,
    lineHeight: 18,
    marginBottom: 14,
  },
  packCount: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AI_PURPLE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  packCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: AI_PURPLE,
  },
  alertBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
  },
  alertBannerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  alertBannerSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  alertBannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  alertBannerTextError: {
    color: '#B91C1C',
  },
  alertBannerTextSuccess: {
    color: '#047857',
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: SLATE_500,
    fontWeight: '500',
  },
  emptyWrap: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 18,
    backgroundColor: SLATE_50,
    borderWidth: 1,
    borderColor: SLATE_200,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SLATE_700,
  },
  emptyBody: {
    fontSize: 13,
    color: SLATE_500,
    textAlign: 'center',
    lineHeight: 18,
  },
  packList: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
