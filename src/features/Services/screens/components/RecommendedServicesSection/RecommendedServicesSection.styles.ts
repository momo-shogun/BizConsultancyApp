import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const SCREEN_WIDTH =
  Dimensions.get('window').width;

const CARD_WIDTH = SCREEN_WIDTH * 0.78;

export const styles = StyleSheet.create({
  section: {
    paddingTop: 10,
    paddingBottom: 36,
    backgroundColor: '#F8FAFC',
  },

  // Header
  headerWrap: {
    paddingHorizontal: 14,
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
    fontSize: 26,
    lineHeight: 32,

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

  // Scroll
  scrollContent: {
    paddingLeft: 14,
    paddingRight: 6,
  },

  // Card
  card: {
    width: CARD_WIDTH,

    borderRadius: 24,
    overflow: 'hidden',

    borderWidth: 1,

    marginRight: 12,
  },

  cardPressed: {
    opacity: 0.9,
  },

  topAccent: {
    width: '100%',
    height: 5,
  },

  cardContent: {
    padding: 16,
  },

  // Top
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 14,
  },

  iconWrap: {
    width: 42,
    height: 42,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',
  },

  iconArrow: {
    fontSize: 20,
    fontWeight: '700',
  },

  tag: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 999,
  },

  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Content
  serviceTitle: {
    fontSize: 17,
    lineHeight: 24,

    color: '#0F172A',
    fontWeight: '700',

    letterSpacing: -0.3,
  },

  serviceDescription: {
    marginTop: 10,

    fontSize: 13,
    lineHeight: 22,

    color: '#475569',
    fontWeight: '500',
  },

  // Footer
  footer: {
    marginTop: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  exploreText: {
    fontSize: 13,
    fontWeight: '700',
  },

  footerArrow: {
    fontSize: 17,
    fontWeight: '700',
  },
});