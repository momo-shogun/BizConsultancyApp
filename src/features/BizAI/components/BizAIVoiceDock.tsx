import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BizAIBrandCapsule } from './BizAIBrandCapsule';
import { BizAIOrbButton } from './BizAIOrbButton';

type BizAIVoiceDockProps = {
  onKeyboardPress: () => void;
  onMicPress: () => void;
  onBrandPress: () => void;
};

export function BizAIVoiceDock({
  onKeyboardPress,
  onMicPress,
  onBrandPress,
}: BizAIVoiceDockProps): React.ReactElement {
  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.root}>
      <LinearGradient
        colors={['transparent', 'rgba(11,15,25,0.55)', 'rgba(11,15,25,0.94)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Animated.Text entering={FadeIn.duration(200)} style={styles.hint} numberOfLines={2}>
        Tap to talk
      </Animated.Text>
      <Text style={styles.comingSoon} numberOfLines={1}>
        Voice input coming soon
      </Text>

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
          isListening={false}
          onPress={onMicPress}
          accessibilityLabel="Voice input coming soon"
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
    marginBottom: THEME.spacing[6],
    paddingHorizontal: THEME.spacing[16],
  },
  comingSoon: {
    textAlign: 'center',
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.45)',
    marginBottom: THEME.spacing[14],
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
