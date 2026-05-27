import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../../screens/EDPScreen.styles';

export interface EdpLandingCtaSectionProps {
  onContinueLearning?: () => void;
  onTalkToExpert?: () => void;
}

export function EdpLandingCtaSection(props: EdpLandingCtaSectionProps): React.ReactElement {
  return (
    <View style={styles.ctaSection}>
      <Pressable
        onPress={props.onContinueLearning}
        style={styles.ctaPrimary}
        accessibilityRole="button"
        accessibilityLabel="Continue learning"
      >
        <Text style={styles.ctaPrimaryText}>Continue learning</Text>
      </Pressable>
      <Pressable
        onPress={props.onTalkToExpert}
        style={styles.ctaSecondary}
        accessibilityRole="button"
        accessibilityLabel="Talk to an expert"
      >
        <Text style={styles.ctaSecondaryText}>Talk to an expert</Text>
      </Pressable>
    </View>
  );
}
