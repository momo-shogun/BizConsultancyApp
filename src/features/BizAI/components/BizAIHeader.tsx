import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';

type BizAIHeaderProps = {
  onClose: () => void;
  usageBadgeLabel?: string | null;
};

export function BizAIHeader({ onClose, usageBadgeLabel }: BizAIHeaderProps): React.ReactElement {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onClose}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Close Biz AI"
        style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
      >
        <Ionicons name="chevron-down" size={22} color={BIZ_AI_THEME.text.primary} />
      </Pressable>

      <View style={styles.titleWrap}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color={BIZ_AI_THEME.text.accentBright} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Biz AI
        </Text>
        <View style={styles.betaPill}>
          <Text style={styles.betaText}>Assistant</Text>
        </View>
      </View>

      {usageBadgeLabel != null && usageBadgeLabel.length > 0 ? (
        <View style={styles.usagePill} accessibilityLabel={`AI usage ${usageBadgeLabel}`}>
          <Text style={styles.usageText}>{usageBadgeLabel}</Text>
        </View>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const CLOSE_SIZE = BIZ_AI_THEME.touch.min;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BIZ_AI_THEME.spacing.screenX,
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[12],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BIZ_AI_THEME.border.subtle,
  },
  closeBtn: {
    width: CLOSE_SIZE,
    height: CLOSE_SIZE,
    borderRadius: CLOSE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BIZ_AI_THEME.bg.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
  },
  closeBtnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99,102,241,0.18)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.accent,
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: BIZ_AI_THEME.text.primary,
    letterSpacing: 0.2,
  },
  betaPill: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
    borderRadius: BIZ_AI_THEME.radius.pill,
    backgroundColor: BIZ_AI_THEME.bg.elevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.subtle,
  },
  betaText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.medium as '500',
    color: BIZ_AI_THEME.text.muted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  spacer: {
    width: CLOSE_SIZE,
  },
  usagePill: {
    minWidth: CLOSE_SIZE,
    height: 28,
    paddingHorizontal: THEME.spacing[10],
    borderRadius: BIZ_AI_THEME.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(34,197,94,0.35)',
  },
  usageText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#86EFAC',
    letterSpacing: 0.2,
  },
});
