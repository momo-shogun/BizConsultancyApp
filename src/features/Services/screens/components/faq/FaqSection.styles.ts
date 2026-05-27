import { StyleSheet } from 'react-native';

const SLATE_900 = '#0F172A';
const SLATE_600 = '#475569';
const SLATE_500 = '#64748B';
const SLATE_200 = '#E2E8F0';
const SLATE_100 = '#F1F5F9';
const SLATE_50 = '#F8FAFC';
const BLUE_600 = '#2563EB';
const BLUE_50 = '#EFF6FF';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: SLATE_50,
  },

  containerEmbedded: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },

  headerWrap: {
    marginBottom: 14,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: BLUE_50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: BLUE_600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: SLATE_900,
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: SLATE_500,
    fontWeight: '500',
  },

  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SLATE_200,
    overflow: 'hidden',
  },

  listEmbedded: {
    borderRadius: 12,
  },

  card: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_200,
  },

  cardOpen: {
    backgroundColor: '#FAFBFC',
  },

  lastCard: {
    borderBottomWidth: 0,
  },

  questionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },

  questionWrapCompact: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  questionBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: BLUE_50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  questionBadgeCompact: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 8,
  },

  questionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLUE_600,
  },

  questionBadgeTextCompact: {
    fontSize: 10,
  },

  question: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: SLATE_900,
    fontWeight: '600',
    letterSpacing: -0.15,
  },

  questionCompact: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },

  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: SLATE_100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  chevronWrapCompact: {
    width: 22,
    height: 22,
    borderRadius: 7,
  },

  chevronOpen: {
    backgroundColor: BLUE_50,
  },

  answerWrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 0,
  },

  answerWrapCompact: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  answer: {
    fontSize: 12.5,
    lineHeight: 19,
    color: SLATE_600,
    fontWeight: '400',
  },

  answerCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
});
