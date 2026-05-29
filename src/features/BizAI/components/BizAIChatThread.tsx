import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';
import type { BizAiChatMessage } from '../types/bizAiChat.types';

import { BizAIConversationCard } from './BizAIConversationCard';

export interface BizAIChatThreadProps {
  messages: BizAiChatMessage[];
}

function createMessagePairs(messages: BizAiChatMessage[]): Array<{
  key: string;
  user: BizAiChatMessage;
  assistant: BizAiChatMessage | null;
}> {
  const pairs: Array<{
    key: string;
    user: BizAiChatMessage;
    assistant: BizAiChatMessage | null;
  }> = [];

  let index = 0;
  while (index < messages.length) {
    const current = messages[index];
    if (current == null) {
      index += 1;
      continue;
    }
    if (current.role === 'user') {
      const next = messages[index + 1];
      const assistant = next != null && next.role === 'assistant' ? next : null;
      pairs.push({
        key: current.id,
        user: current,
        assistant,
      });
      index += assistant != null ? 2 : 1;
      continue;
    }
    pairs.push({
      key: current.id,
      user: {
        id: `${current.id}-synthetic-user`,
        role: 'user',
        content: '',
        createdAt: current.createdAt,
      },
      assistant: current,
    });
    index += 1;
  }

  return pairs;
}

export function BizAIChatThread(props: BizAIChatThreadProps): React.ReactElement {
  const pairs = createMessagePairs(props.messages);

  return (
    <View style={styles.thread}>
      {pairs.map((pair, index) => {
        if (pair.assistant != null) {
          return (
            <BizAIConversationCard
              key={pair.key}
              query={pair.user.content}
              response={pair.assistant.content}
              responseLabel={pair.assistant.responseLabel ?? null}
            />
          );
        }

        return (
          <Animated.View
            key={pair.key}
            entering={FadeInUp.duration(220).delay(index * 20)}
            style={styles.userOnlyCard}
          >
            <View style={styles.userLabelRow}>
              <Ionicons name="person-circle-outline" size={16} color={BIZ_AI_THEME.text.muted} />
              <Text style={styles.userLabel}>Your question</Text>
            </View>
            <Text style={styles.userText}>{pair.user.content}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: THEME.spacing[14],
  },
  userOnlyCard: {
    borderRadius: BIZ_AI_THEME.radius.lg,
    padding: BIZ_AI_THEME.spacing.block,
    backgroundColor: BIZ_AI_THEME.bg.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    gap: THEME.spacing[8],
    ...BIZ_AI_THEME.shadow.card,
  },
  userLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userLabel: {
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
});
