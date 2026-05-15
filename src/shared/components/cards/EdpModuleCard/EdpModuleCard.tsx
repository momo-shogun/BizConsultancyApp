import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { accentAlpha, edpCardBase } from '../edp/edpCardShared';

export type EdpModuleStatus = 'done' | 'active' | 'locked';

export interface EdpModuleCardItem {
  id: string;
  name: string;
  icon: string;
  lessons: number;
  duration: string;
  progress: number;
  status: EdpModuleStatus;
  accent: string;
}

export interface EdpModuleCardProps {
  item: EdpModuleCardItem;
  onPress?: () => void;
}

const STATUS_LABEL: Record<EdpModuleStatus, string> = {
  done: 'Done',
  active: 'In progress',
  locked: 'Locked',
};

export function EdpModuleCard(props: EdpModuleCardProps): React.ReactElement {
  const { item } = props;
  const accent = item.accent;
  const isLocked = item.status === 'locked';

  return (
    <Pressable
      onPress={props.onPress}
      style={[edpCardBase.card, styles.card]}
      disabled={isLocked || props.onPress == null}
    >
      <View style={edpCardBase.shimmer} />
      <View style={styles.inner}>
        <View style={[styles.iconWrap, { borderColor: accentAlpha(accent, 0.33) }]}>
          <View style={[styles.iconInner, { backgroundColor: accentAlpha(accent, 0.13) }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, isLocked ? styles.nameLocked : null]} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{item.lessons} lessons</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.progress}%`,
                  backgroundColor: isLocked ? 'rgba(15,23,42,0.15)' : accent,
                },
              ]}
            />
          </View>
        </View>
        <View
          style={[
            styles.statusPill,
            {
              borderColor: accentAlpha(accent, 0.33),
              backgroundColor: accentAlpha(accent, 0.1),
            },
          ]}
        >
          <Text style={[styles.statusText, { color: accent }]}>{STATUS_LABEL[item.status]}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing[10],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: THEME.typography.size[18],
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: THEME.spacing[4],
  },
  nameLocked: {
    color: THEME.colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    marginBottom: THEME.spacing[8],
  },
  metaText: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },
  metaDot: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  progressBg: {
    height: 3,
    backgroundColor: 'rgba(15,23,42,0.08)',
    borderRadius: 100,
  },
  progressFill: {
    height: 3,
    borderRadius: 100,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: THEME.spacing[4],
    flexShrink: 0,
  },
  statusText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.2,
  },
});
