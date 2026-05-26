import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const PROFILE_CANVAS = '#F4F7FB';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[28],
  },
  hero: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    borderRadius: 18,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing[16],
    gap: THEME.spacing[10],
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 51,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  changePhotoText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  photoHint: {
    fontSize: 11,
    color: SLATE_MUTED,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing[24],
  },
  sectionLabel: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[8],
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: SLATE_MUTED,
  },
  card: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    padding: THEME.spacing[14],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
    gap: THEME.spacing[12],
  },
  readOnlyWrap: {
    gap: 6,
  },
  readOnlyLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  readOnlyBox: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  readOnlyValue: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  readOnlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(100,116,139,0.12)',
  },
  readOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: SLATE_MUTED,
    textTransform: 'uppercase',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
  },
  rowField: {
    flex: 1,
  },
  genderWrap: {
    gap: 8,
  },
  genderLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  genderChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(5,150,105,0.08)',
  },
  genderChipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  genderChipTextActive: {
    color: THEME.colors.primary,
  },
  saveButton: {
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[4],
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
    gap: THEME.spacing[12],
  },
  centeredText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },
  retryButtonText: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
