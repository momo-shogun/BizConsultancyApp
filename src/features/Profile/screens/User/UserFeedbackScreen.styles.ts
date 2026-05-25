import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const USER_FEEDBACK_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  android: { elevation: 2 },
  default: {},
});

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: USER_FEEDBACK_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[32],
    gap: THEME.spacing[14],
  },
  heroCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[16],
    ...CARD_SHADOW,
  },
  heroTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
    marginBottom: THEME.spacing[6],
  },
  heroDesc: {
    fontSize: THEME.typography.size[13],
    lineHeight: 20,
    color: '#475569',
  },
  formCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[16],
    gap: THEME.spacing[18],
    ...CARD_SHADOW,
  },
  fieldBlock: {
    gap: THEME.spacing[10],
  },
  label: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#0F172A',
  },
  labelMuted: {
    fontWeight: THEME.typography.weight.regular as '400',
    color: '#64748B',
  },
  requiredMark: {
    color: '#E11D48',
  },
  starRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: THEME.spacing[6],
  },
  starButton: {
    padding: THEME.spacing[6],
    borderRadius: THEME.radius[12],
  },
  ratingHint: {
    marginLeft: THEME.spacing[4],
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#475569',
  },
  input: {
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: USER_FEEDBACK_CANVAS,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[12],
    fontSize: THEME.typography.size[15],
    color: '#0F172A',
  },
  textArea: {
    minHeight: 120,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: USER_FEEDBACK_CANVAS,
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
    fontSize: THEME.typography.size[15],
    lineHeight: 22,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    backgroundColor: '#ECFDF5',
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: THEME.spacing[14],
  },
  infoText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: '#065F46',
  },
  submitButton: {
    minHeight: 52,
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[20],
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[24],
    gap: THEME.spacing[14],
  },
  centeredText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
  },
  signInButton: {
    paddingHorizontal: THEME.spacing[18],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  signInButtonText: {
    color: THEME.colors.white,
    fontWeight: THEME.typography.weight.semibold as '600',
    fontSize: THEME.typography.size[14],
  },
});
