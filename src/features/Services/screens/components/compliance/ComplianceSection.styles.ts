import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 36,
    backgroundColor: '#F8FAFC',
  },

  // Header
  headerCard: {
    marginBottom: 24,
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

  description: {
    marginTop: 10,

    fontSize: 13.5,
    lineHeight: 22,

    color: '#64748B',
    fontWeight: '500',
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 2,
  },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Left Side
  timelineLeft: {
    width: 28,
    alignItems: 'center',
  },

  timelineDot: {
    width: 14,
    height: 14,

    borderRadius: 999,

    borderWidth: 3,

    marginTop: 18,

    zIndex: 2,
  },

  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#DCE7F5',
    marginTop: 2,
  },

  // Card
  card: {
    flex: 1,

    borderRadius: 20,

    paddingHorizontal: 14,
    paddingVertical: 14,

    marginBottom: 14,

    borderWidth: 1,

    overflow: 'hidden',
  },

  topAccent: {
    // width: 44,
    // height: 5,

    borderRadius: 999,

    // marginBottom: 12,
  },

  itemText: {
    fontSize: 13,
    lineHeight: 21,

    color: '#334155',
    fontWeight: '600',
  },
});