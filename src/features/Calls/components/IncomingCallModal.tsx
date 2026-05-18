import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppSelector } from '@/store/typedHooks';

import { CallController } from '../controllers/CallController';

export function IncomingCallModal(): React.ReactElement {
  const phase = useAppSelector((s) => s.call.phase);
  const remoteName = useAppSelector((s) => s.call.remoteDisplayName);
  const visible = phase === 'incoming_ringing';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Ionicons name="call" size={40} color="#0F5132" />
          <Text style={styles.title}>Incoming call</Text>
          <Text style={styles.subtitle}>{remoteName}</Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.btn, styles.decline]}
              onPress={() => void CallController.declineIncoming()}
            >
              <Ionicons name="call" size={24} color="#fff" style={styles.declineIcon} />
              <Text style={styles.btnText}>Decline</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.accept]}
              onPress={() => void CallController.acceptIncoming()}
            >
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.btnText}>Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  decline: {
    backgroundColor: '#DC2626',
  },
  accept: {
    backgroundColor: '#0F5132',
  },
  declineIcon: {
    transform: [{ rotate: '135deg' }],
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
