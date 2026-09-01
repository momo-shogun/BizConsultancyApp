import { Platform, StyleSheet } from 'react-native';

import { ACCOUNT_SUBSCREEN_HEADER_COLOR } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

/** Matches hero gradient top — status bar + ScreenHeader */
export const BIZ_AI_CREDITS_HEADER_COLOR = ACCOUNT_SUBSCREEN_HEADER_COLOR;
export const BIZ_AI_CREDITS_HEADER_GRADIENT = ['#0F172A', '#1E1B4B', '#312E81'] as const;

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
    paddingTop: 4,
    gap: 12,
  },
  headerBand: {
    paddingBottom: 16,
  },
  headerAccessory: {
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
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
    gap: 12,
    marginBottom: 16,
  },
  heroTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  heroEyebrow: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    letterSpacing: 0.8,
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
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  refreshPillPressed: {
    opacity: 0.88,
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
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 17,
  },
  walletFloatCard: {
    marginHorizontal: 16,
    marginTop: 4,
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
    fontSize: THEME.typography.size[12],
    color: SLATE_500,
    lineHeight: 17,
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
