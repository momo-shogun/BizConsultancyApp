import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 36,
    backgroundColor: '#F8FAFC',
  },

  // Header
  headerWrap: {
    marginBottom: 20,
  },

  badge: {
    alignSelf: 'flex-start',

    backgroundColor: '#DBEAFE',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.2,
  },

  title: {
    fontSize: 27,
    lineHeight: 33,

    fontWeight: '700',
    color: '#0F172A',

    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 10,

    fontSize: 13.5,
    lineHeight: 22,

    color: '#64748B',
    fontWeight: '500',
  },

  // List
  list: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    overflow: 'hidden',

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 18,

    elevation: 2,
  },

  // Card
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  lastCard: {
    borderBottomWidth: 0,
  },

  // Question
  questionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 14,
  },

  questionBadge: {
    width: 30,
    height: 30,

    borderRadius: 999,

    backgroundColor: '#EFF6FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
    marginTop: 1,
  },

  questionBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  question: {
    flex: 1,

    fontSize: 15,
    lineHeight: 23,

    color: '#0F172A',
    fontWeight: '700',

    letterSpacing: -0.2,
  },

  // Chevron
  chevron: {
    fontSize: 22,
    color: '#334155',
  },

  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },

  // Answer
  answerWrap: {
    flexDirection: 'row',

    paddingHorizontal: 18,
    paddingBottom: 18,
    marginTop: -4,
  },

  answerLine: {
    width: 2,
    borderRadius: 999,

    backgroundColor: '#BFDBFE',

    marginLeft: 14,
    marginRight: 26,
  },

  answer: {
    flex: 1,

    fontSize: 13.5,
    lineHeight: 23,

    color: '#475569',
    fontWeight: '500',
  },
});