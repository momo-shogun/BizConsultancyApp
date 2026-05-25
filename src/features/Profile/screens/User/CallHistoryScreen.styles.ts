import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: THEME.spacing[16],
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing[20],
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },

  headerAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },

  headerTitle: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: -0.4,
  },

  countBadge: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[4],
    borderRadius: 999,
    backgroundColor: 'rgba(251,191,36,0.14)',
  },

  countText: {
    color: THEME.colors.accentAmber,
    fontWeight: THEME.typography.weight.bold,
  },

  refreshButton: {
    backgroundColor: '#38BDF8',

    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],

    borderRadius: 999,

    shadowColor: '#38BDF8',
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 6,
  },

  refreshText: {
    color: THEME.colors.white,
    fontWeight: THEME.typography.weight.bold,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: THEME.colors.white,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 18,

    paddingHorizontal: THEME.spacing[14],

    marginBottom: THEME.spacing[20],

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 3,
  },

  searchIcon: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[16],
  },

  searchInput: {
    flex: 1,

    color: THEME.colors.textPrimary,

    padding: THEME.spacing[14],

    fontSize: THEME.typography.size[14],
  },

  listContent: {
    gap: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
  },

  card: {
    backgroundColor: THEME.colors.white,

    borderRadius: 20,

    padding: THEME.spacing[16],

    borderWidth: 1,
    borderColor: '#EEF2F7',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.07,

    shadowRadius: 18,

    elevation: 5,

    overflow: 'hidden',
  },

  cardShimmerEdge: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 2,

    opacity: 0.5,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftBlock: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
    flex: 1,
  },

  iconOuter: {
    width: 52,
    height: 52,

    borderRadius: 26,

    borderWidth: 1,

    borderColor: '#E2E8F0',

    backgroundColor: THEME.colors.white,

    justifyContent: 'center',
    alignItems: 'center',
  },

  iconInner: {
    width: 44,
    height: 44,

    borderRadius: 22,

    justifyContent: 'center',
    alignItems: 'center',
  },

  videoIcon: {
    color: '#38BDF8',

    fontSize: THEME.typography.size[20],
  },

  info: {
    gap: THEME.spacing[8],
    flex: 1,
  },

  type: {
    color: THEME.colors.textPrimary,

    fontSize: THEME.typography.size[16],

    fontWeight: THEME.typography.weight.bold,
  },

  meta: {
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },

  consultant: {
    color: THEME.colors.textPrimary,

    fontWeight:
      THEME.typography.weight.medium,
  },

  rightBlock: {
    alignItems: 'flex-end',
    gap: THEME.spacing[10],
  },

  statusBadge: {
    borderWidth: 1,

    borderRadius: 999,

    paddingHorizontal:
      THEME.spacing[12],

    paddingVertical:
      THEME.spacing[4],
  },

  statusText: {
    fontWeight:
      THEME.typography.weight.bold,
  },

  callId: {
    color:
      THEME.colors.textSecondary,

    fontSize:
      THEME.typography.size[12],
  },

  rateButton: {
    backgroundColor:
      'rgba(251,191,36,0.12)',

    borderWidth: 1,

    borderColor:
      'rgba(251,191,36,0.25)',

    borderRadius: 999,

    paddingHorizontal:
      THEME.spacing[14],

    paddingVertical:
      THEME.spacing[8],
  },

  rateText: {
    color:
      THEME.colors.accentAmber,

    fontWeight:
      THEME.typography.weight.bold,
  },

  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    paddingVertical: THEME.spacing[24],
  },

  stateText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },

  errorText: {
    fontSize: THEME.typography.size[14],
    color: '#DC2626',
    textAlign: 'center',
    paddingHorizontal: THEME.spacing[16],
  },

  retryButton: {
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[10],
    borderRadius: 999,
    backgroundColor: '#38BDF8',
  },

  retryText: {
    color: THEME.colors.white,
    fontWeight: THEME.typography.weight.bold,
  },
});