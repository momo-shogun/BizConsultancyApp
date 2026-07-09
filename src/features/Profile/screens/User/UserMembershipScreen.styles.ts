import { StyleSheet } from 'react-native';
import { THEME } from '@/constants/theme';

const styles = StyleSheet.create({
  // ── Main card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: THEME.colors.surface,          // white / card bg
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Top row: star icon + ACTIVE badge ───────────────────────────────────
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

  // ── Plan name / subtitle ─────────────────────────────────────────────────
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

  // ── Info grid (Amount/Validity, Start/Expiry) ─────────────────────────────
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
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },

  // ── Progress bar ─────────────────────────────────────────────────────────
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
    color: THEME.colors.primary,           // green accent
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
    backgroundColor: THEME.colors.primary, // green
  },

  // ── Payment card ──────────────────────────────────────────────────────────
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

  // ── Service item ──────────────────────────────────────────────────────────
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
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing[4],
  },
  serviceIcon: {
    fontSize: 18,
  },
  serviceContent: {
    flex: 1,
    gap: THEME.spacing[4],
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
    color: '#E65100',   // orange-ish for PENDING
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
  requestButtonText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.primary,
  },

  // Legacy (kept for safety if referenced elsewhere)
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