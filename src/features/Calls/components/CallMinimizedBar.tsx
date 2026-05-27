import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { useCallTimer } from '../hooks/useCallTimer';
import { formatCallDuration } from '../utils/formatCallDuration';
import { CallAvatar } from './CallAvatar';

export function CallMinimizedBar(): React.ReactElement | null {
  const insets = useSafeAreaInsets();
  const phase = useAppSelector((s) => s.call.phase);
  const isMinimized = useAppSelector((s) => s.call.isMinimized);
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const remoteAvatarUrl = useAppSelector((s) => s.call.remoteAvatarUrl);
  const callType = useAppSelector((s) => s.call.callType);
  const reconnecting = useAppSelector((s) => s.call.reconnecting);
  const elapsedSeconds = useCallTimer();

  if (phase !== 'in_call' || !isMinimized) {
    return null;
  }

  const statusText = reconnecting ? 'Reconnecting…' : formatCallDuration(elapsedSeconds);

  return (
    <View style={[styles.container, { top: insets.top + 6 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <Pressable
          style={styles.barMain}
          onPress={() => CallController.expandCall()}
          accessibilityRole="button"
          accessibilityLabel="Return to call"
        >
          <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={44} />
          <View style={styles.meta}>
            <Text style={styles.name} numberOfLines={1}>
              {remoteName}
            </Text>
            <View style={styles.statusRow}>
              {callType === 'video' ? (
                <Ionicons name="videocam" size={12} color="#4ADE80" style={styles.videoIcon} />
              ) : (
                <View style={styles.liveDot} />
              )}
              <Text style={styles.status}>{statusText}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          style={styles.endBtn}
          onPress={() => {
            void CallController.endCall();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="End call"
        >
          <Ionicons name="call" size={22} color="#fff" style={styles.endIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 16,
    backgroundColor: '#0F5132',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  barMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  videoIcon: {
    marginRight: 0,
  },
  status: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    fontVariant: ['tabular-nums'],
  },
  endBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
