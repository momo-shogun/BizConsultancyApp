import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// tighter spacing + compact cards
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2;

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
  },

  // Header
  headerContainer: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.7,
  },

  sectionSubtitle: {
    marginTop: 8,

    fontSize: 13,
    lineHeight: 21,

    color: '#64748B',
    fontWeight: '500',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card
  card: {
    width: CARD_WIDTH,

    borderRadius: 20,
    overflow: 'hidden',

    borderWidth: 1,

    marginBottom: 12,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.035,
    shadowRadius: 12,

    elevation: 2,
  },

  // Image
  imageWrapper: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 108,
    backgroundColor: '#E2E8F0',
  },

  imageAccent: {
    position: 'absolute',

    left: 10,
    bottom: -2,

    width: 42,
    height: 5,

    borderRadius: 999,
  },

  // Content
  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  tag: {
    alignSelf: 'flex-start',

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 999,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.25,
  },

  cardTitle: {
    fontSize: 14.5,
    lineHeight: 19,

    fontWeight: '700',
    color: '#0F172A',

    letterSpacing: -0.25,
  },

  cardDescription: {
    marginTop: 6,

    fontSize: 11.5,
    lineHeight: 18,

    color: '#475569',
    fontWeight: '500',
  },
});