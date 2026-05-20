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
        colors={['transparent', 'rgba(11,15,25,0.88)', 'rgba(11,15,25,0.98)']}
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.bar}>
        <Pressable
          onPress={onVoiceModePress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Voice input coming soon"
          style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
        >
          <Ionicons name="chevron-down" size={22} color="rgba(255,255,255,0.88)" />
        </Pressable>

        <View style={styles.inputWrap}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder="Ask about GST, compliance, funding…"
            placeholderTextColor="rgba(255,255,255,0.42)"
            style={styles.input}
            multiline={false}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={onSend}
            autoCorrect
            autoCapitalize="sentences"
          />
        </View>

        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          style={({ pressed }) => [styles.sendWrap, pressed && canSend && styles.sendPressed]}
        >
          <LinearGradient
            colors={canSend ? ['#38BDF8', '#6366F1', '#EC4899'] : ['#334155', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendBtn}
          >
            <Ionicons name="arrow-up" size={20} color={THEME.colors.white} />
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
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[12],
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(20,28,45,0.95)',
    paddingLeft: THEME.spacing[4],
    paddingRight: THEME.spacing[4],
    paddingVertical: THEME.spacing[4],
    minHeight: 52,
  },
  sideBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnPressed: {
    opacity: 0.75,
  },
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.white,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    paddingHorizontal: THEME.spacing[4],
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  sendWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendPressed: {
    opacity: 0.9,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
