import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Screen wrapper ────────────────────────────────────────
  screen: {
    padding: THEME.spacing[0],
  },

  // ── Scroll content ────────────────────────────────────────
  scrollContent: {
    paddingTop: THEME.spacing[20],
    paddingBottom: 110,
  },

  // ── Page title ────────────────────────────────────────────
 titleWrapper: {
  paddingHorizontal: THEME.spacing[16],
  marginBottom: THEME.spacing[20],
},

pageTitle: {
  fontSize: 22,
  fontWeight: '800',
  color: '#1E293B',
  letterSpacing: -0.8,
  lineHeight: 34,
},

titleUnderline: {
  marginTop: THEME.spacing[12],
  width: '42%',
  height: 4,
  borderRadius: 10,
  backgroundColor: '#FFD700',
},

  // ── Plan card shell ───────────────────────────────────────
  planCard: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[12],
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 8,
  },
  planCardInner: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
  },

  // ── Plan header row ───────────────────────────────────────
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing[16],
  },
  planHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  planNameWhite: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  planNameBlue: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentBlue,
    letterSpacing: -0.2,
  },
  planNameAmber: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentAmber,
    letterSpacing: -0.2,
  },
  planChevronIcon: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textSecondary,
  },

  // ── Ads-free badge ────────────────────────────────────────
  adsFreeTag: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: THEME.spacing[4],
    borderRadius: 6,
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.40)',
  },
  adsFreeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentAmber,
    letterSpacing: 0.8,
  },

  // ── Separator between header and body ─────────────────────
  headerDivider: {
    height: 1,
    backgroundColor: 'grey',
    marginBottom: THEME.spacing[16],
  },

  // ── Feature chips ─────────────────────────────────────────
  featureRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[16],
  },
  featureChip: {
    alignItems: 'center',
    gap: THEME.spacing[8],
    flex: 1,
  },
  featureIconBox: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D8BE',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Pill badge inside icon (x1, x2)
  featurePill: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  featurePillText: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    lineHeight: 14,
  },
  // Small labelled box (Ads, HD, FHD)
  featureTagBox: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  featureTagText: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    letterSpacing: 0.3,
  },
  // Generic glyph text inside icon box
  featureGlyph: {
    color: 'black',
    fontSize: THEME.typography.size[16],
  },
  featureLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.black,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ── Price option pills ────────────────────────────────────
  priceOptionsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
  },
  priceOption: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B6AE9F',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[14],
    backgroundColor: 'rgba(255,255,255,0.04)',
    position: 'relative',
    minHeight: 94,
    gap: THEME.spacing[4],
  },
  priceOptionSelected: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DEDED1',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[14],
    backgroundColor: 'rgba(255,255,255,0.09)',
    position: 'relative',
    minHeight: 94,
    gap: THEME.spacing[4],
  },
  priceOptionRadio: {
    position: 'absolute',
    top: THEME.spacing[12],
    right: THEME.spacing[12],
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B6AE9F',
  },
  priceOptionCheckmark: {
    position: 'absolute',
    top: THEME.spacing[12],
    right: THEME.spacing[12],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceOptionCheckmarkText: {
    color: THEME.colors.black,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    lineHeight: 14,
  },
  priceDuration: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.6,
    marginRight: 26,
  },
  priceAmount: {
    fontSize: THEME.typography.size[20],
    color: THEME.colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  pricePerMonth: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },
  pricePerMonthAmber: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.accentAmber,
    fontWeight: THEME.typography.weight.semibold,
  },

  // ── Hollywood note banner ─────────────────────────────────
  hollywoodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: THEME.spacing[14],
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[12],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  hollywoodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    flex: 1,
  },
  hollywoodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hollywoodLockBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#181828',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  hollywoodLockGlyph: {
    fontSize: 8,
    color: THEME.colors.textSecondary,
  },
  hollywoodGlyph: {
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.65)',
  },
  hollywoodTextGroup: {
    flex: 1,
    gap: THEME.spacing[4],
  },
  hollywoodTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  hollywoodSubtitle: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  hollywoodChevron: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.textSecondary,
  },

  // ── Sticky footer ─────────────────────────────────────────
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0A14',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[14],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[16],
  },
  stickyPriceGroup: {
    gap: THEME.spacing[4],
  },
  stickyPrice: {
    fontSize: THEME.typography.size[24],
    color: THEME.colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  stickyPriceLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },
  upgradeCta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[16],
    borderRadius: 999,
    backgroundColor: THEME.colors.textPrimary,
  },
  upgradeCtaText: {
    color: THEME.colors.black,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },
  upgradeCtaChevron: {
    color: THEME.colors.black,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },
});