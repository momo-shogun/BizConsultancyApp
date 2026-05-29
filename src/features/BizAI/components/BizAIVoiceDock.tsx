import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';
import { BizAIOrbButton } from './BizAIOrbButton';

type BizAIVoiceDockProps = {
  onKeyboardPress: () => void;
  onMicPress: () => void;
  isListening: boolean;
  isSpeechAvailable: boolean;
};

export function BizAIVoiceDock({
  onKeyboardPress,
  onMicPress,
  isListening,
  isSpeechAvailable,
}: BizAIVoiceDockProps): React.ReactElement {
  const statusLabel = isListening
    ? 'Listening now'
    : isSpeechAvailable
      ? 'Tap to talk'
      : 'Voice unavailable';

  const subLabel = isSpeechAvailable
    ? 'Voice recognition enabled'
    : 'Speech recognition unavailable';

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.root}>
      <LinearGradient
        colors={[...BIZ_AI_THEME.gradient.dockFade]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Animated.Text entering={FadeIn.duration(200)} style={styles.hint} numberOfLines={2}>
        {statusLabel}
      </Animated.Text>
      <Text style={styles.subHint} numberOfLines={1}>
        {subLabel}
      </Text>

      <View style={styles.controls}>
        <View style={styles.sideSlot}>
          <Pressable
            onPress={onKeyboardPress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Switch to keyboard input"
            style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
          >
            <Ionicons name="keypad-outline" size={22} color={BIZ_AI_THEME.text.secondary} />
          </Pressable>
        </View>

        <View style={styles.centerSlot}>
          <BizAIOrbButton
            size={58}
            isListening={isListening}
            onPress={onMicPress}
            accessibilityLabel={isListening ? 'Stop listening' : 'Start listening'}
          />
        </View>

        <View style={styles.sideSlot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[8],
    paddingHorizontal: BIZ_AI_THEME.spacing.screenX,
    minHeight: 168,
    justifyContent: 'flex-end',
  },
  hint: {
    textAlign: 'center',
    fontSize: THEME.typography.size[17],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: BIZ_AI_THEME.text.primary,
    marginBottom: THEME.spacing[6],
    paddingHorizontal: THEME.spacing[16],
    letterSpacing: -0.2,
  },
  subHint: {
    textAlign: 'center',
    fontSize: THEME.typography.size[12],
    color: BIZ_AI_THEME.text.muted,
    marginBottom: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[4],
  },
  sideSlot: {
    width: BIZ_AI_THEME.touch.min,
    alignItems: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  sideBtn: {
    width: BIZ_AI_THEME.touch.min,
    height: BIZ_AI_THEME.touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BIZ_AI_THEME.radius.pill,
    backgroundColor: BIZ_AI_THEME.bg.elevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.subtle,
  },
  sideBtnPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
});
