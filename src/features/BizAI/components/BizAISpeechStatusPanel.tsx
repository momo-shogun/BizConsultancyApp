import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

interface BizAISpeechStatusPanelProps {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  volume: number;
  errorMessage: string | null;
}

export function BizAISpeechStatusPanel(props: BizAISpeechStatusPanelProps): React.ReactElement {
  const { isListening, transcript, partialTranscript, volume, errorMessage } = props;
  const liveText = partialTranscript.trim().length > 0 ? partialTranscript : transcript;

  return (
    <View style={styles.panel}>
      <View style={styles.statusRow}>
        <View style={[styles.dot, isListening ? styles.dotLive : styles.dotIdle]} />
        <Text style={styles.statusText}>{isListening ? 'Listening...' : 'Tap mic to start'}</Text>
        <View style={styles.volumePill}>
          <Ionicons name="pulse-outline" size={12} color="#C4B5FD" />
          <Text style={styles.volumeText}>{Math.max(0, Math.round(volume * 10) / 10)}</Text>
        </View>
      </View>

      {liveText.trim().length > 0 ? (
        <Text style={styles.transcript} numberOfLines={4}>
          {liveText}
        </Text>
      ) : (
        <Text style={styles.placeholder}>Your spoken words will appear here.</Text>
      )}

      {errorMessage != null ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color="#FCA5A5" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[10],
    borderRadius: 14,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    backgroundColor: 'rgba(15,23,42,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(148,163,184,0.35)',
    gap: THEME.spacing[8],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotLive: {
    backgroundColor: '#22C55E',
  },
  dotIdle: {
    backgroundColor: '#64748B',
  },
  statusText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.86)',
    fontWeight: THEME.typography.weight.medium as '500',
  },
  volumePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  volumeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  transcript: {
    color: '#F8FAFC',
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
  },
  placeholder: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: THEME.typography.size[12],
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
  },
});
