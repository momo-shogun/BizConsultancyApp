import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';

type BizAIConversationCardProps = {
  query: string;
  response?: string;
  responseLabel?: string | null;
  hint?: string;
};

export function BizAIConversationCard({
  query,
  response,
  responseLabel,
  hint,
}: BizAIConversationCardProps): React.ReactElement {
  const hasResponse = response != null && response.trim().length > 0;

  return (
    <Animated.View entering={FadeInUp.duration(280).springify()} style={styles.card}>
      <View style={styles.userBlock}>
        <View style={styles.userLabelRow}>
          <Ionicons name="person-circle-outline" size={16} color={BIZ_AI_THEME.text.muted} />
          <Text style={styles.label}>Your question</Text>
        </View>
        <Text style={styles.userText}>{query}</Text>
      </View>

      {hasResponse ? (
        <View style={styles.aiBlock}>
          <View style={styles.aiLabelRow}>
            <View style={styles.aiIconWrap}>
              <Ionicons name="sparkles" size={12} color={BIZ_AI_THEME.text.accentBright} />
            </View>
            <Text style={styles.aiLabel}>
              {responseLabel != null && responseLabel.length > 0 ? responseLabel : 'Biz AI'}
            </Text>
          </View>
          <Text style={styles.aiText}>{response}</Text>
        </View>
      ) : null}

      {hint != null && hint.length > 0 ? (
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={14} color={BIZ_AI_THEME.text.faint} />
          <Text style={styles.hint}>{hint}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BIZ_AI_THEME.radius.lg,
    padding: BIZ_AI_THEME.spacing.block,
    backgroundColor: BIZ_AI_THEME.bg.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    gap: THEME.spacing[14],
    ...BIZ_AI_THEME.shadow.card,
  },
  userBlock: {
    gap: THEME.spacing[8],
  },
  userLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: BIZ_AI_THEME.text.muted,
    letterSpacing: 0.3,
  },
  userText: {
    fontSize: THEME.typography.size[15],
    color: BIZ_AI_THEME.text.primary,
    lineHeight: 23,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  aiBlock: {
    paddingTop: THEME.spacing[12],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BIZ_AI_THEME.border.subtle,
    gap: THEME.spacing[10],
  },
  aiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99,102,241,0.2)',
  },
  aiLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: BIZ_AI_THEME.text.accent,
    letterSpacing: 0.4,
  },
  aiText: {
    fontSize: THEME.typography.size[14],
    color: BIZ_AI_THEME.text.secondary,
    lineHeight: 22,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: THEME.spacing[4],
  },
  hint: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: BIZ_AI_THEME.text.faint,
    lineHeight: 18,
  },
});
