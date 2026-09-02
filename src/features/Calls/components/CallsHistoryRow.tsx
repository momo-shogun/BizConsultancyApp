import React, { memo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { CallsHistoryAvatar } from '@/features/Calls/components/CallsHistoryAvatar';
import type { CallsTabRowModel } from '@/features/Calls/utils/callsTabHistoryDisplay';

import { styles } from './CallsHistoryRow.styles';

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
  const actionIcon = row.isVideo ? 'videocam' : 'call';
  const canPress = row.canCallBack && !isStarting;

  return (
    <>
      <Pressable
        accessibilityRole={row.canCallBack ? 'button' : undefined}
        accessibilityLabel={
          row.canCallBack
            ? row.isVideo
              ? `Call ${row.displayName} on video`
              : `Call ${row.displayName}`
            : `${row.displayName}, ${row.subtitleLabel}`
        }
        disabled={!canPress}
        onPress={onPressAction}
        android_disableSound
        unstable_pressDelay={0}
        style={({ pressed }) => [
          styles.row,
          pressed && canPress ? styles.rowPressed : null,
        ]}
      >
        <CallsHistoryAvatar name={row.displayName} uri={row.avatarUri} isVideo={row.isVideo} />

        <View style={styles.body}>
          <Text
            style={[styles.name, row.isMissed ? styles.nameMissed : null]}
            numberOfLines={1}
          >
            {row.displayName}
          </Text>
          <Text
            style={[styles.subtitle, row.isMissed ? styles.subtitleMissed : null]}
            numberOfLines={1}
          >
            {row.subtitleLabel}
          </Text>
        </View>

        <View style={styles.trailing}>
          {row.timeLabel.length > 0 ? (
            <Text style={styles.time}>{row.timeLabel}</Text>
          ) : null}

          {row.canCallBack ? (
            <View
              style={[
                styles.actionBtn,
                row.isVideo ? styles.actionBtnVideo : null,
                !canPress ? styles.actionBtnDisabled : null,
              ]}
            >
              {isStarting ? (
                <ActivityIndicator size="small" color={CALLS_TAB_THEME.accent} />
              ) : (
                <Ionicons
                  name={actionIcon}
                  size={20}
                  color={row.isVideo ? CALLS_TAB_THEME.video : CALLS_TAB_THEME.accent}
                />
              )}
            </View>
          ) : null}
        </View>
      </Pressable>
      {isLast ? null : <View style={styles.separator} />}
    </>
  );
});
