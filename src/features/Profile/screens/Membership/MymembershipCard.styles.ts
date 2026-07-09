import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  card: {
    backgroundColor: '#0F2A1A',
    borderRadius: 20,
    padding: THEME.spacing[16],

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,

    overflow: 'hidden',
  },

  cardShimmerEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(52,211,153,0.6)',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing[16],
  },

  planName: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
  },

  planMeta: {
    marginTop: THEME.spacing[4],
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
  },

  statusBadge: {
    backgroundColor: 'rgba(52,211,153,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.33)',
    borderRadius: 999,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },

  statusBadgeText: {
    color: '#34D399',
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
  },

  progressSection: {
    marginBottom: THEME.spacing[16],
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[8],
  },

  progressLabel: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
  },

  daysRemaining: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: THEME.colors.border,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#34D399',
  },

  remainingContainer: {
    alignItems: 'center',
  },

  remainingValue: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[24],
    fontWeight: THEME.typography.weight.bold,
  },

  remainingLabel: {
    marginTop: THEME.spacing[4],
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
  },

  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[32],
  },
});