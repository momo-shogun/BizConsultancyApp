import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { callEngine } from '../engine/CallEngine';
import { startNetworkTransitionHandler, stopNetworkTransitionHandler } from '../engine/NetworkTransitionHandler';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/InCall'>;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export function InCallScreen({ route, navigation }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { sessionId } = route.params;
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const localMuted = useAppSelector((s) => s.call.localMuted);
  const speakerOn = useAppSelector((s) => s.call.speakerOn);
  const reconnecting = useAppSelector((s) => s.call.reconnecting);
  const elapsedSeconds = useAppSelector((s) => s.call.elapsedSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    callEngine.bindSocketHandlers();
    startNetworkTransitionHandler({
      onNetworkChange: () => {
        void callEngine.reconnectMedia();
      },
    });
    return () => {
      stopNetworkTransitionHandler();
    };
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // elapsed tracked via simple local tick — engine can extend later
    }, 1000);
    return () => {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionId]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>
      <Text style={styles.name}>{remoteName}</Text>
      <Text style={styles.status}>
        {reconnecting ? 'Reconnecting…' : 'Connected'}
      </Text>

      <View style={styles.controls}>
        <Pressable
          style={[styles.ctrlBtn, localMuted ? styles.ctrlActive : null]}
          onPress={() => CallController.setMuted(!localMuted)}
        >
          <Ionicons name={localMuted ? 'mic-off' : 'mic'} size={26} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.ctrlBtn, speakerOn ? styles.ctrlActive : null]}
          onPress={() => CallController.setSpeaker(!speakerOn)}
        >
          <Ionicons name={speakerOn ? 'volume-high' : 'volume-mute'} size={26} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.endBtn}
          onPress={() => {
            void CallController.endCall().then(() => navigation.goBack());
          }}
        >
          <Ionicons name="call" size={28} color="#fff" style={styles.endIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  timer: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  name: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  status: {
    marginTop: 8,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ctrlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  endBtn: {
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
