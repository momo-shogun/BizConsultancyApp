/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: THEME.spacing[20],
    paddingTop: THEME.spacing[24] + 20, // Add some safe area padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    color: '#0F172A',
  },
  searchContainer: {
    padding: THEME.spacing[16],
    backgroundColor: THEME.colors.white,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: THEME.spacing[12],
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    color: '#334155',
  },
  filterTabsScroll: {
    backgroundColor: THEME.colors.white,
    paddingBottom: THEME.spacing[12],
  },
  filterTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  filterTab: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[8],
    borderRadius: 9999,
    backgroundColor: '#F1F5F9',
  },
  filterTabActive: {
    backgroundColor: '#0F172A',
  },
  filterTabText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: '#64748B',
  },
  filterTabTextActive: {
    color: THEME.colors.white,
  },
  dropdownChipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
  },
  dropdownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: THEME.colors.white,
    gap: THEME.spacing[4],
  },
  dropdownChipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: '#475569',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[24],
    marginBottom: THEME.spacing[16],
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
    marginRight: THEME.spacing[10],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: THEME.typography.weight.bold,
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  countBadge: {
    marginLeft: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
  },
  countBadgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.accentAmber,
  },
  viewAnalyticsText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: '#38BDF8',
  },
  transactionList: {
    paddingHorizontal: THEME.spacing[16],
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    // Android Elevation
    elevation: 8,
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  cardContent: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[16],
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMain: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.black,
    flex: 1,
    marginRight: 8,
  },
  cardAmount: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.black,
  },
  cardId: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing[8],
  },
  cardDate: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.bold,
    textTransform: 'uppercase',
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    gap: THEME.spacing[16],
  },
  separatorText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: THEME.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navItem: {
    alignItems: 'center',
  },
  navIconWrapper: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 4,
  },
  navIconWrapperActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  navText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    color: '#64748B',
  },
  navTextActive: {
    color: '#0F172A',
    fontWeight: THEME.typography.weight.bold,
  },
});
