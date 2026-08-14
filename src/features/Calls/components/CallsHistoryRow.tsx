import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { CallsHistoryAvatar } from '@/features/Calls/components/CallsHistoryAvatar';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import type { CallsTabRowModel } from '@/features/Calls/utils/callsTabHistoryDisplay';

export interface CallsHistoryRowProps {
  row: CallsTabRowModel;
  isLast: boolean;
  onPressAction: () => void;
}

export const CallsHistoryRow = memo(function CallsHistoryRow(
  props: CallsHistoryRowProps,
): React.ReactElement {
  const { row, isLast, onPressAction } = props;
  const nameColor = row.isMissed ? CALLS_TAB_THEME.missed : CALLS_TAB_THEME.textPrimary;
  const directionIcon = row.isOutgoing ? 'arrow-up' : 'arrow-down';
  const actionIcon = row.item.callType === 'video' ? 'videocam' : 'call';

  return (
    <View style={[styles.row, isLast ? styles.rowLast : null]}>
      <CallsHistoryAvatar name={row.displayName} uri={row.avatarUri} />

      <View style={styles.body}>
        <Text style={[styles.name, { color: nameColor }]} numberOfLines={1}>
          {row.displayName}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name={directionIcon}
            size={12}
            color={CALLS_TAB_THEME.textSecondary}
            style={row.isOutgoing ? styles.directionOut : styles.directionIn}
          />
          <Text style={styles.medium} numberOfLines={1}>
            {row.mediumLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.time}>{row.timeLabel}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          row.item.callType === 'video' ? 'Start video call' : 'Start voice call'
        }
        hitSlop={8}
        onPress={onPressAction}
        style={({ pressed }) => [styles.actionBtn, pressed ? styles.actionBtnPressed : null]}
      >
        <Ionicons name={actionIcon} size={18} color={CALLS_TAB_THEME.accent} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    paddingVertical: 14,
    paddingHorizontal: THEME.spacing[16],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CALLS_TAB_THEME.separator,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  directionOut: {
    transform: [{ rotate: '45deg' }],
    marginTop: 1,
  },
  directionIn: {
    transform: [{ rotate: '-45deg' }],
    marginTop: 1,
  },
  medium: {
    flex: 1,
    fontSize: 14,
    color: CALLS_TAB_THEME.textSecondary,
  },
  time: {
    fontSize: 14,
    color: CALLS_TAB_THEME.textSecondary,
    marginRight: 2,
    flexShrink: 0,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    opacity: 0.75,
  },
});
