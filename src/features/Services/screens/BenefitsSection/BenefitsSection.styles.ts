import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
  },

  // Header
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.6,
  },

  sectionSubtitle: {
    marginTop: 6,
    marginBottom: 18,

    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },

  // List Entypo
  benefitsList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#565758',
  },

  benefitItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#454647',
    
  },

  lastBenefitItem: {
    borderBottomWidth: 0,
  },

  // Header Row
  header: {
    minHeight: 72,

    paddingHorizontal: 20,
    paddingVertical: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleWrap: {
    flex: 1,
    paddingRight: 16,
  },

  benefitTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },

  // Chevron
  chevron: {
    fontSize: 22,
    color: '#334155',
  },

  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },

  // Expand Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -4,
  },

  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#475569',
    fontWeight: '500',
  },
});