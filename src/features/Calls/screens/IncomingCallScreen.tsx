import React, { useEffect } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { ImagePlaceholder, RemoteImage } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { callRingtoneService } from '../services/callRingtoneService';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/IncomingCall'>;

function callTypeLabel(callType: string | null): string {
  if (callType === 'video') {
    return 'Video call';
  }
  return 'Voice call';
}

export function IncomingCallScreen({ navigation }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const phase = useAppSelector((s) => s.call.phase);
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const remoteAvatarUrl = useAppSelector((s) => s.call.remoteAvatarUrl);
  const callType = useAppSelector((s) => s.call.callType);
  const callOutcome = useAppSelector((s) => s.call.callOutcome);
  const isRinging = phase === 'incoming_ringing';
  const isConnecting = phase === 'connecting_media';
  const showResult = phase === 'ended' && callOutcome !== 'none';

  useEffect(() => {
    if (!isRinging) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [isRinging]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (!isRinging) {
        return;
      }
      e.preventDefault();
    });
    return unsub;
  }, [isRinging, navigation]);

  useEffect(() => {
    return () => {
      callRingtoneService.stop();
    };
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.center}>
        <View style={styles.avatarRing}>
          {remoteAvatarUrl != null ? (
            <RemoteImage
              uri={remoteAvatarUrl}
              style={styles.avatarImage}
              placeholderVariant="avatar"
            />
          ) : (
            <ImagePlaceholder variant="avatar" style={styles.avatarImage} />
          )}
        </View>
        <Text style={styles.name}>{remoteName}</Text>
        <Text style={styles.callType}>{callTypeLabel(callType)}</Text>

        {showResult ? (
          <>
            <Text style={styles.resultTitle}>
              {callOutcome === 'rejected' ? 'Rejected' : 'Call ended'}
            </Text>
            <Text style={styles.resultHint}>Closing…</Text>
          </>
        ) : isConnecting ? (
          <>
            <Text style={styles.status}>Connecting…</Text>
            <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
          </>
        ) : (
          <>
            <Text style={styles.status}>Incoming call</Text>
            <Text style={styles.pulse}>Ringing…</Text>
          </>
        )}
      </View>

      {isRinging ? (
        <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
          <Pressable
            style={[styles.actionBtn, styles.declineBtn]}
            onPress={() => void CallController.declineIncoming()}
            accessibilityRole="button"
            accessibilityLabel="Decline call"
          >
            <Ionicons name="call" size={32} color="#fff" style={styles.declineIcon} />
            <Text style={styles.actionLabel}>Decline</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => void CallController.acceptIncoming()}
            accessibilityRole="button"
            accessibilityLabel="Accept call"
          >
            <Ionicons name="call" size={32} color="#fff" />
            <Text style={styles.actionLabel}>Accept</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B3D2C',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    marginTop: 28,
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  callType: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  status: {
    marginTop: 12,
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  pulse: {
    marginTop: 8,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },
  spinner: {
    marginTop: 20,
  },
  resultTitle: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  resultHint: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  acceptBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineIcon: {
    transform: [{ rotate: '135deg' }],
  },
  actionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
