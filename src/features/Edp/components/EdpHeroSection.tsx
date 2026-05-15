import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { EDP_HERO_BG } from '../data/edpLandingData';

export interface EdpHeroSectionProps {
  onGetStarted: () => void;
  onAskQuestion?: () => void;
}

export function EdpHeroSection(props: EdpHeroSectionProps): React.ReactElement {
  return (
    <View style={styles.block}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✦  Government certified programme</Text>
      </View>
      <Text style={styles.title}>Build a compliant,{'\n'}sustainable business</Text>
      <Text style={styles.subtitle}>
        Module-by-module learning — video lectures, downloads, and assessments toward certification.
      </Text>
      <View style={styles.actions}>
        <Pressable
          onPress={props.onGetStarted}
          style={styles.btnPrimary}
          accessibilityRole="button"
          accessibilityLabel="Get started with EDP programme"
        >
          <Text style={styles.btnPrimaryText}>Get started</Text>
        </Pressable>
        <Pressable
          onPress={props.onAskQuestion}
          style={styles.btnSecondary}
          accessibilityRole="button"
          accessibilityLabel="Ask a question about EDP"
        >
          <Text style={styles.btnSecondaryText}>Ask a question</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: EDP_HERO_BG,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[24],
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.42)',
    borderRadius: 100,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[4],
    marginBottom: THEME.spacing[12],
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.accentAmber,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: THEME.typography.size[24],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    lineHeight: 28,
    letterSpacing: -0.35,
    marginBottom: THEME.spacing[10],
  },
  subtitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 17,
    marginBottom: THEME.spacing[20],
  },
  actions: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.2,
    color: EDP_HERO_BG,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.2,
    color: THEME.colors.white,
  },
});
