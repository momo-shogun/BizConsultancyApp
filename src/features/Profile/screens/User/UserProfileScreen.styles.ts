import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const USER_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

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
    backgroundColor: USER_CANVAS,
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
    backgroundColor: USER_CANVAS,
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
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  settingsBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.1,
  },
  subscriptionCard: {
    marginHorizontal: 0,
    marginTop: THEME.spacing[4],
    marginBottom: 0,
    borderRadius: THEME.radius[16],
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
    ...CARD_SHADOW_RESET,
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
  notificationCard: {
    marginHorizontal: THEME.spacing[12],
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  notificationShimmer: {
    height: 2,
    backgroundColor: '#7C3AED',
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
