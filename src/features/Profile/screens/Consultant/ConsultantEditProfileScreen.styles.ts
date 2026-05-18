import { StyleSheet } from 'react-native';
import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 20,
  },

  banner: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  bannerText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: '#374151',
    lineHeight: 18,
  },

  sectionLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },

  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },

  readOnlyWrap: {
    gap: 6,
  },
  readOnlyLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textSecondary,
  },
  readOnlyBox: {
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  readOnlyBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  readOnlyBadgeText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.medium,
  },

  dropdownWrap: {
    gap: 6,
  },
  dropdownLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  dropdown: {
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    paddingHorizontal: 16,
  },

  textareaWrap: {
    gap: 6,
  },
  textareaLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  textarea: {
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
    minHeight: 90,
    textAlignVertical: 'top',
  },

  helperText: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: -8,
    lineHeight: 16,
  },

  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: THEME.colors.white,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  saveBtn: {
    borderRadius: 14,
    minHeight: 52,
  },
});
