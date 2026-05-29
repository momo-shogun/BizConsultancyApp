import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

/** Full-bleed white sheet (Zepto / Flipkart style) */
export const USER_FEEDBACK_CANVAS = '#FFFFFF';

const HAIRLINE = '#F0F0F0';
const FIELD_BG = '#F7F8FA';
const FIELD_BG_FOCUS = '#FFFFFF';
const SLATE_MUTED = '#878787';
const TEXT_PRIMARY = '#1C1C1C';
const EMERALD = '#059669';
const EMERALD_DARK = '#047857';

const STICKY_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  android: { elevation: 12 },
  default: {},
});

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: USER_FEEDBACK_CANVAS,
  },
  body: {
    flex: 1,
    backgroundColor: USER_FEEDBACK_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    marginTop: THEME.spacing[6],
    fontSize: THEME.typography.size[14],
    lineHeight: 21,
    color: SLATE_MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: HAIRLINE,
    marginVertical: THEME.spacing[20],
  },
  section: {
    marginBottom: THEME.spacing[22],
  },
  sectionLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: THEME.spacing[14],
  },
  requiredMark: {
    color: '#E11D48',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[4],
  },
  starButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingCaption: {
    marginTop: THEME.spacing[12],
    fontSize: THEME.typography.size[15],
    fontWeight: '600',
    color: EMERALD_DARK,
    textAlign: 'center',
  },
  ratingCaptionMuted: {
    marginTop: THEME.spacing[12],
    fontSize: THEME.typography.size[14],
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[10],
  },
  fieldLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  fieldOptional: {
    fontWeight: '400',
    color: SLATE_MUTED,
  },
  charCount: {
    fontSize: THEME.typography.size[11],
    color: '#B0B0B0',
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: FIELD_BG,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[13],
    fontSize: THEME.typography.size[15],
    color: TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    backgroundColor: FIELD_BG_FOCUS,
    borderColor: EMERALD,
  },
  textArea: {
    minHeight: 128,
    borderRadius: 8,
    backgroundColor: FIELD_BG,
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[13],
    paddingBottom: THEME.spacing[13],
    fontSize: THEME.typography.size[15],
    lineHeight: 22,
    color: TEXT_PRIMARY,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[4],
  },
  trustText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: SLATE_MUTED,
  },
  stickyBar: {
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    backgroundColor: USER_FEEDBACK_CANVAS,
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    ...STICKY_SHADOW,
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: EMERALD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    backgroundColor: EMERALD_DARK,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: THEME.typography.size[15],
    fontWeight: '700',
    color: THEME.colors.white,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  stickyHint: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[11],
    lineHeight: 16,
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[32],
    backgroundColor: USER_FEEDBACK_CANVAS,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: FIELD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[16],
  },
  centeredTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: THEME.spacing[8],
  },
  centeredText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 22,
    color: SLATE_MUTED,
    textAlign: 'center',
    marginBottom: THEME.spacing[24],
  },
  secondaryButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: FIELD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: '#EEEEEE',
  },
  secondaryButtonText: {
    fontSize: THEME.typography.size[15],
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  pressed: {
    opacity: 0.9,
  },
});
