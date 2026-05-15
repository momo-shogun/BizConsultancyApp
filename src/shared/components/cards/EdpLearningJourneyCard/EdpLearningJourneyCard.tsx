import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { accentAlpha, edpCardBase } from '../edp/edpCardShared';

export interface EdpJourneyStep {
  step: number;
  title: string;
  description: string;
  accent: string;
}

export interface EdpLearningJourneyCardProps {
  steps: EdpJourneyStep[];
}

export function EdpLearningJourneyCard(props: EdpLearningJourneyCardProps): React.ReactElement {
  return (
    <View style={[edpCardBase.cardBordered, styles.card]}>
      {props.steps.map((step, index) => (
        <EdpJourneyStepRow
          key={step.step}
          step={step}
          isLast={index === props.steps.length - 1}
        />
      ))}
    </View>
  );
}

interface EdpJourneyStepRowProps {
  step: EdpJourneyStep;
  isLast: boolean;
}

function EdpJourneyStepRow(props: EdpJourneyStepRowProps): React.ReactElement {
  const { step, isLast } = props;
  const accent = step.accent;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.circle, { borderColor: accent, backgroundColor: accentAlpha(accent, 0.13) }]}>
          <Text style={[styles.stepNum, { color: accent }]}>{step.step}</Text>
        </View>
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={[styles.content, isLast ? styles.contentLast : null]}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.desc}>{step.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: THEME.spacing[16],
  },
  row: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  left: {
    alignItems: 'center',
    width: 32,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNum: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
  },
  line: {
    width: 1.5,
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.15)',
    marginVertical: THEME.spacing[4],
  },
  content: {
    flex: 1,
    paddingBottom: THEME.spacing[16],
  },
  contentLast: {
    paddingBottom: 0,
  },
  title: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: THEME.spacing[4],
  },
  desc: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },
});
