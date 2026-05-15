import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: THEME.typography.size[20],
    color: THEME.colors.textPrimary,
  },
  headerTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },

  // ── Menu Items ────────────────────────────────────────────
  menuList: {
    paddingTop: THEME.spacing[8],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[20],
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[16],
  },
  menuIconInner: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: THEME.typography.size[18],
  },
  menuTextGroup: {
    flex: 1,
    gap: THEME.spacing[4],
  },
  menuTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
    color: THEME.colors.textSecondary,
  },
  menuChevron: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textSecondary,
  },
  menuChevronDown: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textSecondary,
    transform: [{ rotate: '0deg' }],
  },

  // ── Card Group ────────────────────────────────────────────
  menuCard: {
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[16],
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: THEME.colors.white,
  },
  menuCardShimmer: {
    height: 1,
   // backgroundColor: THEME.colors.accentBlue,
    opacity: 0.6,
  },
  menuCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.white,
  },
  menuCardItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[16],
  },

  // ── Log Out ───────────────────────────────────────────────
  logoutContainer: {
    marginTop: THEME.spacing[24],
    alignItems: 'center',
  },
  logoutBtn: {
    paddingHorizontal: THEME.spacing[24],
    paddingVertical: THEME.spacing[14],
  },
  logoutText: {
    color: THEME.colors.accentBlue,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
    letterSpacing: 0.2,
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[20],
    gap: THEME.spacing[8],
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  footerLink: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
  },
  footerDot: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
  },
  footerVersion: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    opacity: 0.6,
  },

  // ── Bottom Nav ────────────────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0A0A12',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[24],
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E50000',
  },
  bottomNavIcon: {
    fontSize: 20,
    color: THEME.colors.textSecondary,
  },
  bottomNavAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A3A5C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.accentBlue,
  },
  bottomNavAvatarText: {
    fontSize: 16,
  },
  bottomNavLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.accentBlue,
    fontWeight: THEME.typography.weight.semibold,
    marginTop: THEME.spacing[4],
  },
  bottomNavItemWrapper: {
    alignItems: 'center',
  },
});