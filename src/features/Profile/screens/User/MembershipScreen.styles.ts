import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Screen wrapper ────────────────────────────────────────
  screen: {
    padding: THEME.spacing[0],
  },

  scrollContent: {
    paddingTop: THEME.spacing[20],
    paddingBottom: 110,
  },

  // ── Page title ────────────────────────────────────────────
  titleWrapper: {
    paddingHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[20],
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 34,
    textAlign: 'center',
  },
  pageTitleAccent: {
    color: '#6366F1',
    fontStyle: 'italic',
  },
  titleUnderline: {
    marginTop: THEME.spacing[10],
    width: '42%',
    height: 3,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  pageSubtitle: {
    marginTop: THEME.spacing[10],
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Plan card shell ───────────────────────────────────────
  planCard: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[16],
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  planCardInner: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: 22,
    paddingBottom: THEME.spacing[16],
    alignItems: 'center',
  },

  // ── Card top decoration ───────────────────────────────────
  cardBlob: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 88,
    height: 72,
    borderBottomLeftRadius: 56,
    borderTopRightRadius: 18,
    opacity: 0.18,
  },

  // ── Icon circle ───────────────────────────────────────────
  cardIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[10],
  },
  cardIconEmoji: {
    fontSize: 28,
  },

  // ── Plan badge (BASIC / PRO / ADVANCE) ───────────────────
  cardBadge: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: THEME.spacing[8],
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold,
    color: '#fff',
    letterSpacing: 1,
  },

  // ── Plan name ─────────────────────────────────────────────
  cardPlanName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },

  // ── Price ─────────────────────────────────────────────────
  cardPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  cardGstNote: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: THEME.spacing[12],
  },

  // ── Ads-free / Top-tier badge ─────────────────────────────
  adsFreeTag: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    marginBottom: THEME.spacing[8],
  },
  adsFreeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: 0.6,
  },

  // ── Divider ───────────────────────────────────────────────
  headerDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.10)',
    marginBottom: THEME.spacing[14],
  },

  // ── Feature chips (horizontal) ────────────────────────────
  featureRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[14],
  },
  featureChip: {
    alignItems: 'center',
    gap: 5,
    minWidth: 56,
  },
  featureIconBox: {
    width: 56,
    height: 40,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featurePill: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.20)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  featurePillText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold,
    lineHeight: 14,
  },
  featureTagBox: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.20)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  featureTagText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold,
    letterSpacing: 0.3,
  },
  featureGlyph: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[16],
  },
  featureLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ── Full feature list ─────────────────────────────────────
  featureListContainer: {
    width: '100%',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[16],
  },
  featureListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  featureListDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  featureListDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  featureListText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },

  // ── Price option pills ────────────────────────────────────
  priceOptionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[14],
  },
  priceOption: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'relative',
    minHeight: 86,
    gap: 2,
  },
  priceOptionSelected: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'relative',
    minHeight: 86,
    gap: 2,
  },
  priceOptionRadio: {
    position: 'absolute',
    top: THEME.spacing[10],
    right: THEME.spacing[10],
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.20)',
  },
  priceOptionCheckmark: {
    position: 'absolute',
    top: THEME.spacing[10],
    right: THEME.spacing[10],
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceOptionCheckmarkText: {
    color: '#fff',
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    lineHeight: 12,
  },
  priceDuration: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.5,
    marginRight: 22,
  },
  priceAmount: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  pricePerMonth: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },

  // ── Per-plan CTA button ───────────────────────────────────
  planCtaButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[14],
    borderRadius: 999,
  },
  planCtaText: {
    color: '#fff',
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold,
  },
  planCtaChevron: {
    color: '#fff',
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold,
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
    fontWeight: '700',
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
    backgroundColor: '#6366F1',
  },
  upgradeCtaText: {
    color: '#fff',
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },
  upgradeCtaChevron: {
    color: '#fff',
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },

  // ── Hollywood banner (kept for backward compat) ───────────
  hollywoodBanner: { display: 'none' } as any,
  hollywoodLeft: {} as any,
  hollywoodIconBox: {} as any,
  hollywoodLockBadge: {} as any,
  hollywoodLockGlyph: {} as any,
  hollywoodGlyph: {} as any,
  hollywoodTextGroup: {} as any,
  hollywoodTitle: {} as any,
  hollywoodSubtitle: {} as any,
  hollywoodChevron: {} as any,

  // ── Old header styles (kept for backward compat) ──────────
  planCardHeader: {} as any,
  planHeaderLeft: {} as any,
  headerTopRow: {} as any,
  planNameWhite: {} as any,
  planNameBlue: {} as any,
  planNameAmber: {} as any,
  planChevronIcon: {} as any,
  idButton: {} as any,
  des: {} as any,
  pri: {} as any,
});