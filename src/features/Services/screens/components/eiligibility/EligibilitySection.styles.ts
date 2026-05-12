import { StyleSheet } from 'react-native';
import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
  },

  /** HEADER */
  header: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    alignItems: 'center',
  },

  accentBar: {
    width: 4,
    height: 26,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },

  title: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },

  subtitle: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },

  /** LIST */
  list: {
    gap: THEME.spacing[12],
    marginTop: THEME.spacing[8],
  },

  /** ROW */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  iconInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(245,158,11,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  rowTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },

  rowDesc: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.accentAmber,
    opacity: 0.8,
  },

  /** TRUST BAR */
  trustBar: {
    marginTop: THEME.spacing[16],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  trustItem: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },

  trustDivider: {
    color: 'rgba(255,255,255,0.2)',
  },
});