import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';
import { callEngine } from '../engine/CallEngine';

type Props = NativeStackScreenProps<RootStackParamList, 'Root/OutgoingCall'>;

export function OutgoingCallScreen({ route, navigation }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { sessionId } = route.params;
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const phase = useAppSelector((s) => s.call.phase);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      if (phase !== 'ended' && phase !== 'idle') {
        void CallController.endCall();
      }
    });
    return unsub;
  }, [navigation, phase]);

  useEffect(() => {
    callEngine.bindSocketHandlers();
    const onAccepted = (): void => {
      navigation.replace('Root/InCall', { sessionId });
    };
    const interval = setInterval(() => {
      if (phase === 'in_call' || phase === 'connecting_media') {
        onAccepted();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [navigation, phase, sessionId]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={48} color="#fff" />
      </View>
      <Text style={styles.name}>{remoteName}</Text>
      <Text style={styles.status}>
        {phase === 'outgoing_initiating' ? 'Starting call…' : 'Calling…'}
      </Text>
      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />

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
