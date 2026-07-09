import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({

  // ─── Main Membership Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // ─── Top Row: Star Icon + Active Badge ───────────────────────────────────
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  starIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 22,
    color: '#F5A623',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  activeBadgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: '#2E7D32',
    letterSpacing: 0.5,
  },

  // ─── Plan Name / Subtitle ─────────────────────────────────────────────────
  planName: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },
  planSubtitle: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: -THEME.spacing[8],
  },

  // ─── Info Grid (Amount/Validity, Start/Expiry) ────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    gap: THEME.spacing[24],
  },
  infoCell: {
    gap: THEME.spacing[4],
  },
  infoLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },

  // ─── Progress Bar ─────────────────────────────────────────────────────────
  progressSection: {
    gap: THEME.spacing[8],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  progressElapsed: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weight.medium,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
  },

  // ─── Payment Card ─────────────────────────────────────────────────────────
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIcon: {
    fontSize: 22,
  },
  paymentInfo: {
    flex: 1,
    gap: 2,
  },
  paymentLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  paymentAmount: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },
  paymentStatusBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[4],
  },
  paymentStatusText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: '#2E7D32',
  },

  // ─── Service Item ─────────────────────────────────────────────────────────
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffedd8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing[8],
  },
  serviceIcon: {
    fontSize: 18,
  },
  serviceContent: {
    flex: 1,
    gap: THEME.spacing[8],
  },
  serviceTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  serviceStatus: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    letterSpacing: 0.3,
  },
  serviceStatusPending: {
    color: '#E65100',
  },
  serviceStatusCompleted: {
    color: '#2E7D32',
  },
  requestButton: {
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    borderRadius: 24,
    paddingVertical: THEME.spacing[8],
    alignItems: 'center',
    marginTop: THEME.spacing[4],
  },
  requestButtonDisabled: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  requestButtonText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.primary,
  },
  requestButtonTextDisabled: {
    color: '#94A3B8',
  },

  // ─── Screen Level Styles ──────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[32],
    gap: THEME.spacing[12],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
    gap: THEME.spacing[8],
  },
  emptyTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  servicesSection: {
    gap: THEME.spacing[12],
  },
  servicesTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing[4],
  },

  // ─── Legacy (unused but kept safe) ───────────────────────────────────────
  statusBadge: { display: 'none' },
  statusBadgeText: { display: 'none' },
  cardShimmerEdge: { display: 'none' },
  headerRow: { display: 'none' },
  planMeta: { display: 'none' },
  daysRemaining: { display: 'none' },
  remainingContainer: { display: 'none' },
  remainingValue: { display: 'none' },
  remainingLabel: { display: 'none' },
});

export default styles;