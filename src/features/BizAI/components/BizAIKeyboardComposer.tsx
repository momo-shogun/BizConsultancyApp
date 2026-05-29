import React, { useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInput as TextInputType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';

type BizAIKeyboardComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onVoiceModePress: () => void;
  keyboardHeight: SharedValue<number>;
  autoFocus?: boolean;
};

export function BizAIKeyboardComposer({
  value,
  onChangeText,
  onSend,
  onVoiceModePress,
  keyboardHeight,
  autoFocus = true,
}: BizAIKeyboardComposerProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInputType>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  const dockStyle = useAnimatedStyle(() => ({
    bottom: keyboardHeight.value,
    paddingBottom: keyboardHeight.value > 0 ? 10 : insets.bottom + 10,
  }));

  const canSend = value.trim().length > 0;

  return (
    <Animated.View entering={FadeInDown.duration(240)} style={[styles.root, dockStyle]}>
      <LinearGradient
        colors={[...BIZ_AI_THEME.gradient.dockFade]}
        locations={[0, 0.25, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.bar}>
        <Pressable
          onPress={onVoiceModePress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Switch to voice input"
          style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
        >
          <Ionicons name="mic-outline" size={22} color={BIZ_AI_THEME.text.secondary} />
        </Pressable>

        <View style={styles.inputWrap}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder="Ask about GST, compliance, funding…"
            placeholderTextColor={BIZ_AI_THEME.text.faint}
            style={styles.input}
            multiline={false}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={onSend}
            autoCorrect
            autoCapitalize="sentences"
            accessibilityLabel="Biz AI question input"
          />
        </View>

        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: BIZ_AI_THEME.spacing.screenX - 4,
    paddingTop: THEME.spacing[12],
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    borderRadius: BIZ_AI_THEME.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.default,
    backgroundColor: BIZ_AI_THEME.bg.composer,
    paddingLeft: THEME.spacing[4],
    paddingRight: THEME.spacing[4],
    paddingVertical: THEME.spacing[4],
    minHeight: 54,
    ...BIZ_AI_THEME.shadow.card,
  },
  sideBtn: {
    width: BIZ_AI_THEME.touch.min,
    height: BIZ_AI_THEME.touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BIZ_AI_THEME.radius.md,
  },
  sideBtnPressed: {
    opacity: 0.75,
    backgroundColor: BIZ_AI_THEME.bg.elevated,
  },
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    fontSize: THEME.typography.size[16],
    color: BIZ_AI_THEME.text.primary,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    paddingHorizontal: THEME.spacing[4],
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
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
});
