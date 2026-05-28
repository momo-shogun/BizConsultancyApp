import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

import { CallAvatar } from '../components/CallAvatar';
import { CallVideoLayout } from '../components/CallVideoLayout';
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
  const localVideoEnabled = useAppSelector((s) => s.call.localVideoEnabled);
  const remoteVideoUid = useAppSelector((s) => s.call.remoteVideoUid);
  const remoteVideoEnabled = useAppSelector((s) => s.call.remoteVideoEnabled);
  const credentials = useAppSelector((s) => s.call.credentials);
  const reconnecting = useAppSelector((s) => s.call.reconnecting);
  const phase = useAppSelector((s) => s.call.phase);
  const isMinimized = useAppSelector((s) => s.call.isMinimized);
  const elapsedSeconds = useCallTimer();

  const isVideoCall = (callType ?? credentials?.callType) === 'video';

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

  const topBar = (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <Pressable
        style={[styles.minimizeBtn, isVideoCall ? styles.minimizeBtnVideo : null]}
        onPress={() => CallController.minimizeCall()}
        accessibilityRole="button"
        accessibilityLabel="Minimize call"
      >
        <Ionicons name="chevron-down" size={28} color="#fff" />
      </Pressable>
      {!isVideoCall ? (
        <Text style={styles.topHint}>Swipe down to browse app</Text>
      ) : (
        <View style={styles.videoTopMeta}>
          <Text style={styles.videoTopName} numberOfLines={1}>
            {remoteName}
          </Text>
          <Text style={styles.videoTopStatus}>{statusText}</Text>
        </View>
      )}
      <View style={styles.topSpacer} />
    </View>
  );

  const controls = (
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
      {isVideoCall ? (
        <>
          <InCallControlButton
            icon={localVideoEnabled ? 'videocam' : 'videocam-off'}
            label={localVideoEnabled ? 'Video' : 'No video'}
            active={!localVideoEnabled}
            onPress={() => CallController.setVideoEnabled(!localVideoEnabled)}
          />
          <InCallControlButton
            icon="camera-reverse-outline"
            label="Flip"
            onPress={() => CallController.switchCamera()}
          />
        </>
      ) : null}
      <InCallControlButton
        icon="call"
        label="End"
        variant="danger"
        onPress={() => {
          void CallController.endCall();
        }}
      />
    </View>
  );

  const videoControls = (
    <View style={[styles.videoControlsDock, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.videoControlsPill}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={localVideoEnabled ? 'Turn off video' : 'Turn on video'}
          onPress={() => CallController.setVideoEnabled(!localVideoEnabled)}
          style={({ pressed }) => [
            styles.videoIconBtn,
            !localVideoEnabled ? styles.videoIconBtnActive : null,
            pressed ? styles.videoIconBtnPressed : null,
          ]}
        >
          <Ionicons
            name={localVideoEnabled ? 'videocam-outline' : 'videocam-off-outline'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={localMuted ? 'Unmute microphone' : 'Mute microphone'}
          onPress={() => CallController.setMuted(!localMuted)}
          style={({ pressed }) => [
            styles.videoIconBtn,
            localMuted ? styles.videoIconBtnActive : null,
            pressed ? styles.videoIconBtnPressed : null,
          ]}
        >
          <Ionicons name={localMuted ? 'mic-off-outline' : 'mic-outline'} size={22} color="#FFFFFF" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={speakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          onPress={() => CallController.setSpeaker(!speakerOn)}
          style={({ pressed }) => [styles.videoIconBtn, pressed ? styles.videoIconBtnPressed : null]}
        >
          <Ionicons name={speakerOn ? 'volume-high-outline' : 'volume-mute-outline'} size={22} color="#FFFFFF" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Flip camera"
          onPress={() => CallController.switchCamera()}
          style={({ pressed }) => [styles.videoIconBtn, pressed ? styles.videoIconBtnPressed : null]}
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="End call"
        onPress={() => {
          void CallController.endCall();
        }}
        style={({ pressed }) => [
          styles.videoEndCallBtn,
          pressed ? styles.videoEndCallBtnPressed : null,
        ]}
      >
        <Ionicons name="call" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  if (isVideoCall) {
    return (
      <View style={styles.videoRoot}>
        <CallVideoLayout
          remoteUid={remoteVideoUid}
          remoteVideoEnabled={remoteVideoEnabled}
          localVideoEnabled={localVideoEnabled}
          remoteName={remoteName}
          remoteAvatarUrl={remoteAvatarUrl}
        />
        <View style={styles.videoOverlay} pointerEvents="box-none">
          {topBar}
          {videoControls}
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0B3D2C', '#062A1E', '#041912']} style={styles.root}>
      {topBar}
      <View style={styles.center}>
        <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={140} />
        <Text style={styles.name}>{remoteName}</Text>
        <Text style={styles.callTypeLabel}>Voice call</Text>
        <View style={styles.statusPill}>
          <View style={[styles.liveDot, reconnecting ? styles.liveDotWarn : null]} />
          <Text style={styles.status}>{statusText}</Text>
        </View>
      </View>
      {controls}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  videoRoot: {
    flex: 1,
    backgroundColor: '#0A0F14',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
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
  minimizeBtnVideo: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topHint: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  videoTopMeta: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  videoTopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoTopStatus: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    fontVariant: ['tabular-nums'],
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
  callTypeLabel: {
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
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 4,
  },
  videoControlsDock: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoControlsPill: {
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(6, 32, 45, 0.88)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIconBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  videoIconBtnPressed: {
    opacity: 0.85,
  },
  videoEndCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoEndCallBtnPressed: {
    opacity: 0.9,
  },
});
