import { StyleSheet } from 'react-native';

import {
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';

export const WALLET_CANVAS = ACCOUNT_HUB_LIST_CANVAS;

const HAIRLINE = '#F0F0F0';
const FIELD_BG = '#F7F8FA';
const SLATE_MUTED = '#878787';
const TEXT_PRIMARY = '#1C1C1C';
const EMERALD = '#059669';
const EMERALD_DARK = '#047857';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WALLET_CANVAS,
  },
  scroll: {
    flexGrow: 1,
  },
  headerBalanceShell: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[10],
  },
  headerBalanceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerBalanceText: {
    flex: 1,
    paddingRight: THEME.spacing[12],
  },
  headerBalanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },
  headerBalanceAmount: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  headerBalanceLoader: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  headerRefreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBalanceHint: {
    marginTop: THEME.spacing[8],
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.88)',
  },
  contentSheet: {
    flexGrow: 1,
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: THEME.spacing[20],
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[28],
  },
  section: {
    marginBottom: THEME.spacing[24],
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: THEME.spacing[4],
  },
  sectionMeta: {
    fontSize: 12,
    color: SLATE_MUTED,
    marginBottom: THEME.spacing[14],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: FIELD_BG,
    paddingHorizontal: THEME.spacing[14],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputRowFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: EMERALD,
  },
  currency: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginRight: THEME.spacing[8],
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    padding: 0,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: THEME.spacing[14],
    marginBottom: THEME.spacing[18],
  },
  quickChip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    backgroundColor: FIELD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipActive: {
    backgroundColor: EMERALD,
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: EMERALD,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  addButtonPressed: {
    backgroundColor: EMERALD_DARK,
  },
  addButtonDisabled: {
    opacity: 0.55,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  menuBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  menuRowPressed: {
    backgroundColor: '#FAFAFA',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  menuSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: SLATE_MUTED,
  },
});
