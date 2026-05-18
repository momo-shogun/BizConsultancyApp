import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { setElapsedSeconds } from '../store/callSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/OutgoingCall'>;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export function OutgoingCallScreen({ navigation }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const phase = useAppSelector((s) => s.call.phase);
  const callOutcome = useAppSelector((s) => s.call.callOutcome);
  const elapsedSeconds = useAppSelector((s) => s.call.elapsedSeconds);
  const connectedAtMs = useAppSelector((s) => s.call.connectedAtMs);

  const isAccepted = connectedAtMs != null;
  const showRejected =
    phase === 'ended' && (callOutcome === 'rejected' || callOutcome === 'missed');

  useEffect(() => {
    if (!isAccepted || connectedAtMs == null) {
      return;
    }
    const tick = setInterval(() => {
      const secs = Math.max(0, Math.floor((Date.now() - connectedAtMs) / 1000));
      dispatch(setElapsedSeconds(secs));
    }, 1000);
    return () => clearInterval(tick);
  }, [connectedAtMs, dispatch, isAccepted]);

  const statusText = showRejected
    ? callOutcome === 'missed'
      ? 'No answer'
      : 'Rejected'
    : isAccepted
      ? 'Connected'
      : phase === 'outgoing_initiating'
        ? 'Starting call…'
        : 'Calling…';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={48} color="#fff" />
      </View>
      <Text style={styles.name}>{remoteName}</Text>
      <Text style={[styles.status, showRejected ? styles.statusRejected : null]}>{statusText}</Text>

      {isAccepted ? (
        <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>
      ) : showRejected ? null : (
        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
      )}

      {!showRejected ? (
        <Pressable
          style={styles.endBtn}
          onPress={() => {
            void CallController.endCall().then(() => navigation.goBack());
          }}
          accessibilityRole="button"
          accessibilityLabel="End call"
        >
          <Ionicons name="call" size={28} color="#fff" style={styles.endIcon} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B3D2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
  },
  statusRejected: {
    color: '#FCA5A5',
    fontWeight: '700',
    fontSize: 20,
  },
  timer: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  spinner: {
    marginTop: 24,
  },
  endBtn: {
    position: 'absolute',
    bottom: 48,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
