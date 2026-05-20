import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import type { RootStackParamList } from '@/navigation/types';
import { ImagePlaceholder, RemoteImage } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { callRingtoneService } from '../services/callRingtoneService';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/IncomingCall'>;

function callTypeLabel(callType: string | null): string {
  return callType === 'video' ? 'Video Call' : 'Voice Call';
}

export function IncomingCallScreen({
  navigation,
}: Props): React.ReactElement {
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
    if (!isRinging) return;

    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => sub.remove();
  }, [isRinging]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (!isRinging) return;

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
    <LinearGradient
      colors={['#071A14', '#0B3D2C', '#04110D']}
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.overlayCircleTop} />
      <View style={styles.overlayCircleBottom} />

      <View style={styles.center}>
        <View style={styles.avatarGlow}>
          <View style={styles.avatarRing}>
            {remoteAvatarUrl ? (
              <RemoteImage
                uri={remoteAvatarUrl}
                style={styles.avatarImage}
                placeholderVariant="avatar"
              />
            ) : (
              <ImagePlaceholder
                variant="avatar"
                style={styles.avatarImage}
              />
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text numberOfLines={1} style={styles.name}>
            {remoteName}
          </Text>

          <Text style={styles.callType}>
            {callTypeLabel(callType)}
          </Text>

          {showResult ? (
            <>
              <Text style={styles.resultTitle}>
                {callOutcome === 'rejected'
                  ? 'Call Rejected'
                  : 'Call Ended'}
              </Text>

              <Text style={styles.resultHint}>
                Closing...
              </Text>
            </>
          ) : isConnecting ? (
            <>
              <Text style={styles.status}>
                Connecting...
              </Text>

              <ActivityIndicator
                size="large"
                color="#fff"
                style={styles.spinner}
              />
            </>
          ) : (
            <>
              <Text style={styles.status}>
                Incoming call
              </Text>

              <Text style={styles.pulse}>
                Ringing...
              </Text>
            </>
          )}
        </View>
      </View>

      {isRinging && (
        <View
          style={[
            styles.controls,
            {
              paddingBottom: insets.bottom + 28,
            },
          ]}
        >
          <Pressable
            style={[styles.actionWrapper]}
            onPress={() =>
              void CallController.declineIncoming()
            }
          >
            <View style={[styles.actionBtn, styles.declineBtn]}>
              <Ionicons
                name="call"
                size={30}
                color="#fff"
                style={styles.declineIcon}
              />
            </View>

            <Text style={styles.actionLabel}>
              Decline
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionWrapper]}
            onPress={() =>
              void CallController.acceptIncoming()
            }
          >
            <View style={[styles.actionBtn, styles.acceptBtn]}>
              <Ionicons
                name="call"
                size={30}
                color="#fff"
              />
            </View>

            <Text style={styles.actionLabel}>
              Accept
            </Text>
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const AVATAR_SIZE = 148;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },

  overlayCircleTop: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -120,
    right: -100,
  },

  overlayCircleBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -80,
    left: -60,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  avatarGlow: {
    shadowColor: '#6EE7B7',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 12,
  },

  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
  },

  infoCard: {
    marginTop: 36,
    width: '100%',
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  name: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  callType: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  status: {
    marginTop: 22,
    fontSize: 18,
    color: '#E5E7EB',
    fontWeight: '500',
  },

  pulse: {
    marginTop: 8,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },

  spinner: {
    marginTop: 22,
  },

  resultTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#FCA5A5',
  },

  resultHint: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  actionWrapper: {
    alignItems: 'center',
  },

  actionBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  acceptBtn: {
    backgroundColor: '#22C55E',
  },

  declineBtn: {
    backgroundColor: '#EF4444',
  },

  declineIcon: {
    transform: [{ rotate: '135deg' }],
  },

  actionLabel: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});