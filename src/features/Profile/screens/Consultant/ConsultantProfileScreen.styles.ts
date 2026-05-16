import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

/** Brand green — use sparingly (primary CTA only). */
export const CONSULTANT_ACCENT = THEME.colors.primary;
export const CONSULTANT_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

const CARD_SHADOW_RESET = Platform.select({
  ios: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  android: { elevation: 0 },
  default: {},
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CONSULTANT_CANVAS,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    backgroundColor: CONSULTANT_CANVAS,
  },
  pageTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.25,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  settingsBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.1,
  },
  subscriptionCard: {
    marginHorizontal: THEME.spacing[12],
    marginTop: THEME.spacing[10],
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    backgroundColor: THEME.colors.white,
    padding: THEME.spacing[14],
    ...CARD_SHADOW_RESET,
  },
  subscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[10],
  },
  subscriptionLeft: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  subscriptionPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  subscriptionPlanText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
  },
  subscriptionChevron: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: SLATE_MUTED,
  },
  subscriptionPhone: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  upgradeBtn: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#92400E',
    letterSpacing: 0.2,
  },
  section: {
    marginTop: THEME.spacing[14],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[12],
    marginBottom: THEME.spacing[8],
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15,23,42,0.1)',
    marginLeft: THEME.spacing[10],
    borderRadius: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing[12],
    gap: THEME.spacing[10],
  },
  statCard: {
    marginBottom: 0,
    borderLeftWidth: 3,
    padding: THEME.spacing[12],
    minHeight: 128,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  statCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.55,
    lineHeight: 15,
    paddingTop: 2,
  },
  statValue: {
    marginTop: THEME.spacing[10],
    fontSize: 22,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  statValueMuted: {
    color: '#64748B',
  },
  statSubtitle: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#94A3B8',
  },
  notificationCard: {
    marginHorizontal: THEME.spacing[12],
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  notificationShimmer: {
    height: 2,
    backgroundColor: '#3B82F6',
    opacity: 0.45,
  },
  notificationInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing[12],
  },
  videoThumbnail: {
    width: 88,
    height: 60,
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.surface,
  },
  notificationContent: {
    flex: 1,
    marginLeft: THEME.spacing[12],
    justifyContent: 'center',
    minWidth: 0,
  },
  videoTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
  },
  videoDescription: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing[8],
  },
  watchRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[12],
    marginBottom: THEME.spacing[10],
  },
  watchCardPressable: {
    flex: 1,
    minWidth: 0,
  },
  watchCard: {
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  watchCardSpacer: {
    flex: 1,
    minWidth: 0,
  },
  watchThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'flex-end',
    backgroundColor: '#111827',
  },
  watchThumbnailImage: {
    borderTopLeftRadius: THEME.radius[16],
    borderTopRightRadius: THEME.radius[16],
  },
  watchThumbnailOverlay: {
    ...StyleSheet.absoluteFill,
  },
  watchPlayOverlay: {
    position: 'absolute',
    bottom: THEME.spacing[8],
    left: THEME.spacing[8],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchProgressTrack: {
    height: 3,
    backgroundColor: THEME.colors.surface,
  },
  watchProgressFill: {
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  watchCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
    gap: THEME.spacing[8],
  },
  watchCardTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
  },
  watchCardSubLabel: {
    marginTop: 3,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  watchMoreBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
});
