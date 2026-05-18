import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Scroll ────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    paddingBottom: 110,
    gap: THEME.spacing[4],
  },

  // ── Info banner ───────────────────────────────────────────
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    borderRadius: 12,
    padding: THEME.spacing[14],
    marginBottom: THEME.spacing[16],
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },

  // ── Section label ─────────────────────────────────────────
  sectionLabel: {
    fontSize: 13,
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[8],
    marginTop: THEME.spacing[4],
  },

  // ── Card ──────────────────────────────────────────────────
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
    marginBottom: THEME.spacing[16],
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Error row ─────────────────────────────────────────────
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -THEME.spacing[8],
  },
  errorText: {
    fontSize: THEME.typography.size[12],
    color: '#EF4444',
    fontWeight: THEME.typography.weight.medium,
  },

  // ── Helper text ───────────────────────────────────────────
  helperText: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginTop: -6,
  },

  // ── Security note ─────────────────────────────────────────
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[4],
    marginBottom: THEME.spacing[8],
  },
  securityText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },

  // ── Sticky footer ─────────────────────────────────────────
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.background,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[14],
    paddingBottom: THEME.spacing[24],
  },
  saveBtn: {
    width: '100%',
  },
});