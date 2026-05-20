import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import type { BizAIVoiceStatus } from '../types/bizAiInput.types';
import { BizAIBrandCapsule } from './BizAIBrandCapsule';
import { BizAIOrbButton } from './BizAIOrbButton';

type BizAIVoiceDockProps = {
  status: BizAIVoiceStatus;
  partialText: string;
  errorMessage: string | null;
  onKeyboardPress: () => void;
  onMicPress: () => void;
  onBrandPress: () => void;
};

function statusLabel(status: BizAIVoiceStatus, partialText: string): string {
  if (status === 'listening') {
    return partialText.length > 0 ? partialText : 'Listening…';
  }
  if (status === 'processing') {
    return 'Processing…';
  }
  return 'Tap to talk';
}

export function BizAIVoiceDock({
  status,
  partialText,
  errorMessage,
  onKeyboardPress,
  onMicPress,
  onBrandPress,
}: BizAIVoiceDockProps): React.ReactElement {
  const isListening = status === 'listening';
  const label = statusLabel(status, partialText);

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.root}>
      <LinearGradient
        colors={['transparent', 'rgba(11,15,25,0.55)', 'rgba(11,15,25,0.94)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Animated.Text
        entering={FadeIn.duration(200)}
        style={[styles.hint, isListening && styles.hintListening]}
        numberOfLines={2}
      >
        {label}
      </Animated.Text>

      {errorMessage ? (
        <Text style={styles.error} numberOfLines={2}>
          {errorMessage}
        </Text>
      ) : null}

      <View style={styles.controls}>
        <Pressable
          onPress={onKeyboardPress}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Switch to keyboard input"
          style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
        >
          <Ionicons name="keypad-outline" size={22} color="rgba(255,255,255,0.92)" />
        </Pressable>

        <BizAIOrbButton
          size={58}
          isListening={isListening}
          onPress={onMicPress}
          accessibilityLabel={isListening ? 'Stop listening' : 'Tap to talk'}
        />

        <BizAIBrandCapsule onPress={onBrandPress} compact />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    minHeight: 168,
    justifyContent: 'flex-end',
  },
  hint: {
    textAlign: 'center',
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.92)',
    marginBottom: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[16],
  },
  hintListening: {
    color: '#C7D2FE',
  },
  error: {
    textAlign: 'center',
    fontSize: THEME.typography.size[12],
    color: '#FCA5A5',
    marginBottom: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[4],
  },
  sideBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnPressed: {
    opacity: 0.75,
  },
});
