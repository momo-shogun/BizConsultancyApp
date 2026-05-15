import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { edpCardBase } from '../edp/edpCardShared';

export interface EdpFaqCardProps {
  question: string;
  answer: string;
}

export function EdpFaqCard(props: EdpFaqCardProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <View style={[edpCardBase.card, styles.card]}>
      <Pressable
        style={styles.row}
        onPress={() => setOpen((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.question}>{props.question}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.answerWrap}>
          <Text style={styles.answer}>{props.answer}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing[10],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  question: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  chevron: {
    fontSize: THEME.typography.size[18],
    color: THEME.colors.textSecondary,
    flexShrink: 0,
  },
  answerWrap: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,23,42,0.08)',
    paddingTop: THEME.spacing[12],
  },
  answer: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },
});
