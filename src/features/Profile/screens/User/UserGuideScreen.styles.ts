import { StyleSheet } from 'react-native';

import { ACCOUNT_HUB_LIST_CANVAS } from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

export const GUIDE_CANVAS = ACCOUNT_HUB_LIST_CANVAS;
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GUIDE_CANVAS,
  },
  hero: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    borderRadius: 18,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: THEME.typography.size[18],
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: 'rgba(255,255,255,0.88)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[14],
    marginBottom: THEME.spacing[12],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  tabContent: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[12],
  },
  columnWrapper: {
    gap: THEME.spacing[12],
  },
  videoCard: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    overflow: 'hidden',
  },
  videoCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  thumbWrap: {
    height: 92,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  thumbOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.32)',
  },
  playBtnWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  playBtnIcon: {
    marginLeft: 2,
  },
  videoBody: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
    gap: 4,
  },
  videoTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    lineHeight: 17,
  },
  videoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  faqList: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[24],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
  },
  faqRow: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
  },
  faqRowExpanded: {
    backgroundColor: '#F8FAFC',
  },
  faqRowLast: {
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  faqIndex: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(5,150,105,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  faqIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  faqQuestion: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    lineHeight: 19,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  faqChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  faqChevronExpanded: {
    backgroundColor: 'rgba(5,150,105,0.12)',
  },
  faqAnswerBlock: {
    marginTop: THEME.spacing[10],
    marginLeft: 38,
    padding: THEME.spacing[10],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: '#FFFFFF',
    gap: THEME.spacing[4],
  },
  faqAnswerLine: {
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: SLATE_MUTED,
  },
  faqAnswerLineLead: {
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
});
