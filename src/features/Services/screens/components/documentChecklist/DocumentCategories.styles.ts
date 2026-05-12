import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },

  // Hero
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },

  heroBadgeText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.8,
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },

  // Category Card
  categoryCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },

  categoryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  categoryAccent: {
    width: 6,
    borderRadius: 999,
    alignSelf: 'stretch',
    marginRight: 14,
  },

  categoryTextWrap: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },

  categorySubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },

  countBadge: {
    minWidth: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  countText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Documents
  documentsWrap: {
    marginTop: 18,
    gap: 10,
  },

  documentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FFFFFFCC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  documentDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 6,
    marginRight: 12,
  },

  documentText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});