import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: THEME.spacing[16],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[16],
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  scroll: {
    flex: 1,
    marginTop: THEME.spacing[12],
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: THEME.radius[12],
    padding: THEME.spacing[16],
  },
  emptyText: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  requirementCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[12],
    gap: THEME.spacing[10],
  },
  requirementTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  emptyHint: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  docGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
  },
  docTile: {
    width: '47%',
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: THEME.radius[12],
    padding: THEME.spacing[8],
    backgroundColor: '#FAFAFA',
  },
  docTileSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.06)',
  },
  docTileTop: {
    gap: THEME.spacing[8],
  },
  docPreview: {
    width: '100%',
    height: 96,
    borderRadius: THEME.radius[8],
    backgroundColor: '#E2E8F0',
  },
  docPreviewPlaceholder: {
    width: '100%',
    height: 96,
    borderRadius: THEME.radius[8],
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: {
    marginTop: THEME.spacing[8],
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  previewLink: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#4F46E5',
  },
  footer: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    backgroundColor: THEME.colors.white,
  },
  footerOutlineBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerOutlineText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  footerPrimaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: '#0F5132',
  },
  footerPrimaryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
});
