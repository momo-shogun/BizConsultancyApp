import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

export const highlightColors = {
  blue: {
    text: '#3B82F6',
    border: 'rgba(59,130,246,0.45)',
    bg: 'rgba(59,130,246,0.08)',
  },
  orange: {
    text: '#F97316',
    border: 'rgba(249,115,22,0.45)',
    bg: 'rgba(249,115,22,0.08)',
  },
  emerald: {
    text: '#10B981',
    border: 'rgba(16,185,129,0.45)',
    bg: 'rgba(16,185,129,0.08)',
  },
};

export const styles = StyleSheet.create({
  sectionWrapper: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  gradientGlowTop: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },

  gradientGlowBottom: {
    position: 'absolute',
    bottom: 10,
    left: -20,
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 999,
    backgroundColor: 'rgba(16,185,129,0.06)',
  },

  card: {
    overflow: 'hidden',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 26,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',

    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: {
          width: 0,
          height: 10,
        },
      },
      android: {
        elevation: 7,
      },
    }),
  },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
    paddingVertical: 10,

    marginBottom: 22,

    borderRadius: 999,

    backgroundColor: 'rgba(59,130,246,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.12)',
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    marginRight: 10,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#1D4ED8',
  },

  title: {
    flexWrap: 'wrap',

    fontSize: 30,
    lineHeight: 40,

    fontWeight: '800',
    letterSpacing: -1,

    color: '#0F172A',

    marginBottom: 18,
  },

  introWrapper: {
    marginBottom: 22,
  },

  introText: {
    fontSize: 16,
    lineHeight: 29,

    color: '#475569',
    fontWeight: '500',
  },

  paragraphsContainer: {
    gap: 18,
  },

  paragraphText: {
    fontSize: 15.5,
    lineHeight: 28,

    color: '#64748B',
    fontWeight: '500',
  },

  taglineContainer: {
    marginTop: 30,
    paddingLeft: 16,

    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  taglineBar: {
    width: 4,
    height: '100%',
    minHeight: 48,

    borderRadius: 999,
    marginRight: 14,

    backgroundColor: '#10B981',
  },

  taglineText: {
    flex: 1,

    fontSize: 15.5,
    lineHeight: 27,

    color: '#334155',
    fontWeight: '700',
  },

  inlineText: {
    fontSize: 15.5,
    lineHeight: 28,
    color: '#64748B',
  },

  highlightChip: {
    alignSelf: 'flex-start',

    borderWidth: 1.5,
    borderStyle: 'dashed',

    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 4,

    marginHorizontal: 2,
    marginVertical: 2,
  },

  inlineHighlightChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  highlightText: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});