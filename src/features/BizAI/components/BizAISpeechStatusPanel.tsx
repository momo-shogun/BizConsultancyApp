import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';
import {
  SPEECH_ACTIVE_VOLUME_THRESHOLD,
  SPEECH_SILENCE_TIMEOUT_MS,
} from '../services/speechRecognitionService';

interface BizAISpeechStatusPanelProps {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  volume: number;
  msSinceLowVolume: number;
  errorMessage: string | null;
  bottomInset?: number;
  silenceTimeoutMs?: number;
  volumeThreshold?: number;
  onSend?: () => void;
}

function formatVolumeLevel(value: number): string {
  return String(Math.max(0, Math.round(value * 10) / 10));
}

export function BizAISpeechStatusPanel(props: BizAISpeechStatusPanelProps): React.ReactElement {
  const {
    isListening,
    transcript,
    partialTranscript,
    volume,
    msSinceLowVolume,
    errorMessage,
    bottomInset = 0,
    silenceTimeoutMs = SPEECH_SILENCE_TIMEOUT_MS,
    volumeThreshold = SPEECH_ACTIVE_VOLUME_THRESHOLD,
    onSend,
  } = props;

  const liveText = partialTranscript.trim().length > 0 ? partialTranscript : transcript;
  const hasLiveText = liveText.trim().length > 0;
  const canSend = hasLiveText && onSend != null;
  const isVolumeLow = volume < volumeThreshold;

  const silenceSendThresholdMs = Math.max(3000, silenceTimeoutMs - 400);
  const showSendAction =
    hasLiveText &&
    (!isListening || msSinceLowVolume >= silenceSendThresholdMs);

  const statusLabel = showSendAction
    ? 'Ready to send'
    : isListening
      ? 'Listening…'
      : 'Tap the mic to speak';

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      style={[styles.host, bottomInset > 0 ? { bottom: bottomInset } : null]}
    >
      <View style={styles.panel}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, isListening && !showSendAction ? styles.dotLive : styles.dotIdle]} />
          <Text style={styles.statusText}>{statusLabel}</Text>
          {isListening && !showSendAction ? (
            <View style={[styles.volumePill, isVolumeLow && styles.volumePillLow]}>
              <Ionicons
                name="pulse-outline"
                size={12}
                color={isVolumeLow ? BIZ_AI_THEME.text.muted : BIZ_AI_THEME.text.accent}
              />
              <Text style={[styles.volumeText, isVolumeLow && styles.volumeTextLow]}>
                {formatVolumeLevel(volume)}
              </Text>
            </View>
          ) : null}
        </View>

        {hasLiveText ? (
          showSendAction ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.composerRow}>
              <View style={styles.composerTextWrap}>
                <Text style={styles.transcript} numberOfLines={3} accessibilityLiveRegion="polite">
                  {liveText}
                </Text>
              </View>
              <Pressable
                onPress={onSend}
                disabled={!canSend}
                accessibilityRole="button"
                accessibilityLabel="Send voice message"
                accessibilityState={{ disabled: !canSend }}
                style={({ pressed }) => [styles.sendWrap, pressed && canSend && styles.sendPressed]}
              >
                <LinearGradient
                  colors={
                    canSend
                      ? [...BIZ_AI_THEME.gradient.sendActive]
                      : [...BIZ_AI_THEME.gradient.sendDisabled]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendBtn}
                >
                  <Ionicons name="arrow-up" size={20} color={BIZ_AI_THEME.text.primary} />
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ) : (
            <Text style={styles.transcript} numberOfLines={4} accessibilityLiveRegion="polite">
              {liveText}
            </Text>
          )
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={BIZ_AI_THEME.text.faint} />
            <Text style={styles.placeholder}>Your spoken words will appear here</Text>
          </View>
        )}

        {errorMessage != null ? (
          <View style={styles.errorRow} accessibilityRole="alert">
            <Ionicons name="alert-circle-outline" size={14} color={BIZ_AI_THEME.accent.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: BIZ_AI_THEME.spacing.screenX,
    right: BIZ_AI_THEME.spacing.screenX,
    zIndex: 40,
  },
  panel: {
    borderRadius: BIZ_AI_THEME.radius.lg,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[12],
    backgroundColor: BIZ_AI_THEME.bg.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.strong,
    gap: THEME.spacing[10],
    ...BIZ_AI_THEME.shadow.card,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotLive: {
    backgroundColor: BIZ_AI_THEME.accent.success,
  },
  dotIdle: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  statusText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: BIZ_AI_THEME.text.secondary,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  volumePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: BIZ_AI_THEME.radius.pill,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    backgroundColor: 'rgba(99,102,241,0.2)',
  },
  volumePillLow: {
    backgroundColor: 'rgba(148,163,184,0.18)',
  },
  volumeText: {
    color: BIZ_AI_THEME.text.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  volumeTextLow: {
    color: BIZ_AI_THEME.text.muted,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.spacing[8],
    borderRadius: BIZ_AI_THEME.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    backgroundColor: BIZ_AI_THEME.bg.composer,
    paddingLeft: THEME.spacing[12],
    paddingRight: THEME.spacing[4],
    paddingVertical: THEME.spacing[4],
    minHeight: 52,
  },
  composerTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: THEME.spacing[8],
  },
  sendWrap: {
    borderRadius: BIZ_AI_THEME.radius.md,
    overflow: 'hidden',
  },
  sendPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  sendBtn: {
    width: BIZ_AI_THEME.touch.min,
    height: BIZ_AI_THEME.touch.min,
    borderRadius: BIZ_AI_THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcript: {
    color: BIZ_AI_THEME.text.primary,
    fontSize: THEME.typography.size[14],
    lineHeight: 22,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[4],
  },
  placeholder: {
    color: BIZ_AI_THEME.text.faint,
    fontSize: THEME.typography.size[12],
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: THEME.spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BIZ_AI_THEME.border.subtle,
  },
  errorText: {
    flex: 1,
    color: BIZ_AI_THEME.accent.error,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
  },
});
