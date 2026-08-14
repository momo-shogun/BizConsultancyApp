import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { CallsHistoryAvatar } from '@/features/Calls/components/CallsHistoryAvatar';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import type { CallsTabRowModel } from '@/features/Calls/utils/callsTabHistoryDisplay';

export interface CallsHistoryRowProps {
  row: CallsTabRowModel;
  isLast: boolean;
  isStarting: boolean;
  onPressAction: () => void;
}

export const CallsHistoryRow = memo(function CallsHistoryRow(
  props: CallsHistoryRowProps,
): React.ReactElement {
  const { row, isLast, isStarting, onPressAction } = props;
  const nameColor = row.isMissed ? CALLS_TAB_THEME.missed : CALLS_TAB_THEME.textPrimary;
  const directionIcon = row.isOutgoing ? 'arrow-up' : 'arrow-down';
  const actionIcon = row.item.callType === 'video' ? 'videocam' : 'call';
  const canPress = row.canCallBack && !isStarting;

  return (
    <Pressable
      accessibilityRole={row.canCallBack ? 'button' : undefined}
      accessibilityLabel={
        row.canCallBack
          ? row.item.callType === 'video'
            ? `Call ${row.displayName} on video`
            : `Call ${row.displayName}`
          : undefined
      }
      disabled={!canPress}
      onPress={onPressAction}
      android_disableSound
      unstable_pressDelay={0}
      style={({ pressed }) => [
        styles.row,
        isLast ? styles.rowLast : null,
        pressed && canPress ? styles.rowPressed : null,
      ]}
    >
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

      {row.canCallBack ? (
        <View style={styles.actionBtn}>
          {isStarting ? (
            <ActivityIndicator size="small" color={CALLS_TAB_THEME.accent} />
          ) : (
            <Ionicons name={actionIcon} size={18} color={CALLS_TAB_THEME.accent} />
          )}
        </View>
      ) : null}
    </Pressable>
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
  rowPressed: {
    opacity: 0.82,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
