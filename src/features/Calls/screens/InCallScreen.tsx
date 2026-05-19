import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

import { CallAvatar } from '../components/CallAvatar';
import { InCallControlButton } from '../components/InCallControlButton';
import { CallController } from '../controllers/CallController';
import { callEngine } from '../engine/CallEngine';
import { startNetworkTransitionHandler, stopNetworkTransitionHandler } from '../engine/NetworkTransitionHandler';
import { useCallTimer } from '../hooks/useCallTimer';
import { audioSessionService } from '../services/audioSessionService';
import { formatCallDuration } from '../utils/formatCallDuration';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/InCall'>;

export function InCallScreen({ navigation }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const remoteAvatarUrl = useAppSelector((s) => s.call.remoteAvatarUrl);
  const callType = useAppSelector((s) => s.call.callType);
  const localMuted = useAppSelector((s) => s.call.localMuted);
  const speakerOn = useAppSelector((s) => s.call.speakerOn);
  const reconnecting = useAppSelector((s) => s.call.reconnecting);
  const phase = useAppSelector((s) => s.call.phase);
  const isMinimized = useAppSelector((s) => s.call.isMinimized);
  const elapsedSeconds = useCallTimer();

  useEffect(() => {
    audioSessionService.configureForCall();
    CallController.setSpeaker(true);
  }, []);

  useEffect(() => {
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
    if (phase === 'idle' && !isMinimized) {
      navigation.goBack();
    }
  }, [isMinimized, navigation, phase]);

  const statusText = reconnecting
    ? 'Reconnecting…'
    : `Connected · ${formatCallDuration(elapsedSeconds)}`;
  const callLabel = callType === 'video' ? 'Video call' : 'Voice call';

  return (
    <LinearGradient
      colors={['#0B3D2C', '#062A1E', '#041912']}
      style={styles.root}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.minimizeBtn}
          onPress={() => CallController.minimizeCall()}
          accessibilityRole="button"
          accessibilityLabel="Minimize call"
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.topHint}>Swipe down to browse app</Text>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.center}>
        <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={140} />
        <Text style={styles.name}>{remoteName}</Text>
        <Text style={styles.callType}>{callLabel}</Text>
        <View style={styles.statusPill}>
          <View style={[styles.liveDot, reconnecting ? styles.liveDotWarn : null]} />
          <Text style={styles.status}>{statusText}</Text>
        </View>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 28 }]}>
        <InCallControlButton
          icon={localMuted ? 'mic-off' : 'mic'}
          label={localMuted ? 'Unmute' : 'Mute'}
          active={localMuted}
          onPress={() => CallController.setMuted(!localMuted)}
        />
        <InCallControlButton
          icon={speakerOn ? 'volume-high' : 'ear'}
          label="Speaker"
          active={speakerOn}
          onPress={() => CallController.setSpeaker(!speakerOn)}
        />
        <InCallControlButton
          icon="call"
          label="End"
          variant="danger"
          onPress={() => {
            void CallController.endCall();
          }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  minimizeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHint: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  topSpacer: {
    width: 44,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  name: {
    marginTop: 28,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  callType: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  liveDotWarn: {
    backgroundColor: '#FBBF24',
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
});
