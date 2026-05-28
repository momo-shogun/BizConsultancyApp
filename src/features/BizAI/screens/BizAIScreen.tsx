import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { BizAIKeyboardComposer } from '../components/BizAIKeyboardComposer';
import { BizAISpeechStatusPanel } from '../components/BizAISpeechStatusPanel';
import { BizAISuggestionChip } from '../components/BizAISuggestionChip';
import { BizAIVoiceDock } from '../components/BizAIVoiceDock';
import {
  BIZ_AI_GREETINGS,
  BIZ_AI_SHORTCUTS,
  BIZ_AI_SUGGESTIONS,
} from '../constants/bizAiSuggestions';
import { useBizAIKeyboardInset } from '../hooks/useBizAIKeyboardInset';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { BizAIInputMode } from '../types/bizAiInput.types';

const VOICE_DOCK_HEIGHT = 176;
const KEYBOARD_DOCK_HEIGHT = 72;

export function BizAIScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { keyboardHeight } = useBizAIKeyboardInset();

  const [inputMode, setInputMode] = useState<BizAIInputMode>('keyboard');
  const [query, setQuery] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spin = useSharedValue(0);
  const speech = useSpeechRecognition({
    locale: 'en-US',
    continuous: true,
    interimResults: true,
    silenceTimeoutMs: 4500,
  });
  const {
    isAvailable: isSpeechAvailable,
    isListening: isSpeechListening,
    startListening,
    stopListening,
    abortListening,
    transcript: speechTranscript,
    partialTranscript: speechPartialTranscript,
    volume: speechVolume,
    errorMessage: speechErrorMessage,
  } = speech;

  const greeting = useMemo(
    () => BIZ_AI_GREETINGS[Math.floor(Date.now() / 86_400_000) % BIZ_AI_GREETINGS.length],
    [],
  );

  const onMicPress = useCallback((): void => {
    if (!isSpeechAvailable) {
      showGlobalToast({
        variant: 'error',
        message: 'Speech recognition is unavailable on this device.',
        position: 'bottom',
      });
      return;
    }
    if (isSpeechListening) {
      stopListening();
      return;
    }
    void startListening();
  }, [isSpeechAvailable, isSpeechListening, startListening, stopListening]);

  const close = useCallback((): void => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const onSuggestionPress = useCallback((prompt: string): void => {
    setDraft(prompt);
    setQuery(prompt);
  }, []);

  const onShortcutPress = useCallback(
    (id: string): void => {
      if (id === 'services') {
        navigation.navigate(ROUTES.Root.App, {
          screen: ROUTES.App.Services,
          params: { screen: ROUTES.Services.List },
        });
        return;
      }
      if (id === 'experts') {
        navigation.navigate(ROUTES.Root.ConsultantsList);
      }
    },
    [navigation],
  );

  const openKeyboardMode = useCallback((): void => {
    setInputMode('keyboard');
  }, []);

  const openVoiceMode = useCallback((): void => {
    Keyboard.dismiss();
    setInputMode('voice');
  }, []);

  const onSend = useCallback((): void => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      return;
    }
    if (responseTimerRef.current != null) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }
    setQuery(trimmed);
    setResponse('');
    setIsAwaitingResponse(true);
    Keyboard.dismiss();
    responseTimerRef.current = setTimeout(() => {
      setResponse(`Got it. Here is a quick direction for "${trimmed}".

- I can break this into actionable steps.
- I can suggest the right service flow for your use case.
- I can also draft a checklist you can follow immediately.`);
      setIsAwaitingResponse(false);
      responseTimerRef.current = null;
    }, 1700);
  }, [draft]);

  useEffect(() => {
    const spoken =
      speechPartialTranscript.trim().length > 0 ? speechPartialTranscript : speechTranscript;
    if (inputMode !== 'voice') {
      return;
    }
    if (spoken.trim().length > 0) {
      setDraft(spoken);
    }
  }, [inputMode, speechPartialTranscript, speechTranscript]);

  useEffect(() => {
    if (inputMode !== 'voice' && isSpeechListening) {
      abortListening();
    }
  }, [abortListening, inputMode, isSpeechListening]);

  useEffect(() => {
    if (isAwaitingResponse) {
      spin.value = withRepeat(withTiming(360, { duration: 1800, easing: Easing.linear }), -1, false);
      return;
    }
    cancelAnimation(spin);
    spin.value = 0;
  }, [isAwaitingResponse, spin]);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current != null) {
        clearTimeout(responseTimerRef.current);
      }
      cancelAnimation(spin);
    };
  }, [spin]);

  const loaderIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const bottomPad =
    inputMode === 'voice'
      ? insets.bottom + VOICE_DOCK_HEIGHT
      : insets.bottom + KEYBOARD_DOCK_HEIGHT + 24;
  const showLoaderScreen = isAwaitingResponse;
  const showResultScreen = !isAwaitingResponse && query.length > 0 && response.length > 0;

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor="#0B0F19"
      contentBgColor="#0B0F19"
      statusBarStyle="light-content"
      style={styles.root}
    >
      <LinearGradient
        colors={['#0B0F19', '#111827', '#1E1B4B', '#312E81']}
        locations={[0, 0.45, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: 8 }]}>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
          <Ionicons name="chevron-down" size={28} color={THEME.colors.white} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Ionicons name="sparkles" size={18} color="#A5B4FC" />
          <Text style={styles.headerTitle}>Biz AI</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {showLoaderScreen ? (
        <View style={styles.fullLoaderScreen}>
          <LinearGradient
            colors={['rgba(14,165,233,0.16)', 'rgba(59,130,246,0.06)', 'rgba(168,85,247,0.16)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fullLoaderPanel}
          >
            <Text style={styles.loaderTitle}>Fetching something for you...</Text>
            <Text style={styles.loaderSubTitle}>Working on it</Text>
            <Animated.View style={[styles.loaderOrb, loaderIconStyle]}>
              <Ionicons name="sparkles" size={24} color="#C4B5FD" />
            </Animated.View>
          </LinearGradient>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        >
          {showResultScreen ? (
            <Animated.View entering={FadeIn.duration(220)} style={styles.previewCard}>
              <Text style={styles.previewLabel}>Your question</Text>
              <Text style={styles.previewText}>{query}</Text>
              <View style={styles.responseBlock}>
                <Text style={styles.previewLabel}>Biz AI response</Text>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={FadeInDown.duration(240)}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.subGreeting}>
                  Tap a suggestion or type your question in the keyboard below.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(80).duration(220)} style={styles.shortcutRow}>
                {BIZ_AI_SHORTCUTS.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => onShortcutPress(item.id)}
                    style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
                  >
                    <Ionicons name={item.icon} size={16} color="#C7D2FE" />
                    <Text style={styles.shortcutText}>{item.label}</Text>
                  </Pressable>
                ))}
              </Animated.View>

              <Text style={styles.sectionLabel}>Suggestions for your business</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionRow}
              >
                {BIZ_AI_SUGGESTIONS.map((item, index) => (
                  <BizAISuggestionChip
                    key={item.id}
                    item={item}
                    index={index}
                    onPress={() => onSuggestionPress(item.prompt)}
                  />
                ))}
              </ScrollView>

              {query.length > 0 ? (
                <Animated.View entering={FadeIn.duration(200)} style={styles.previewCard}>
                  <Text style={styles.previewLabel}>Your question</Text>
                  <Text style={styles.previewText}>{query}</Text>
                  <Text style={styles.previewHint}>
                    Full AI chat will connect to Biz Assistant API in the next release.
                  </Text>
                </Animated.View>
              ) : null}
            </>
          )}
        </ScrollView>
      )}

      {!showLoaderScreen && inputMode === 'voice' ? (
        <BizAISpeechStatusPanel
          isListening={isSpeechListening}
          transcript={speechTranscript}
          partialTranscript={speechPartialTranscript}
          volume={speechVolume}
          errorMessage={speechErrorMessage}
        />
      ) : null}

      {!showLoaderScreen && (inputMode === 'voice' ? (
        <View style={[styles.dockHost, { paddingBottom: insets.bottom }]}>
          <BizAIVoiceDock
            onKeyboardPress={openKeyboardMode}
            onMicPress={onMicPress}
            onBrandPress={close}
            isListening={isSpeechListening}
            isSpeechAvailable={isSpeechAvailable}
          />
        </View>
      ) : (
        <BizAIKeyboardComposer
          value={draft}
          onChangeText={setDraft}
          onSend={onSend}
          onVoiceModePress={openVoiceMode}
          keyboardHeight={keyboardHeight}
        />
      ))}
    </SafeAreaWrapper>
  );
}

export default BizAIScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[12],
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  headerSpacer: {
    width: 28,
  },
  scroll: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[8],
  },
  greeting: {
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    lineHeight: 34,
    marginBottom: THEME.spacing[8],
  },
  subGreeting: {
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 20,
    marginBottom: THEME.spacing[20],
  },
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[24],
  },
  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shortcutPressed: {
    opacity: 0.8,
  },
  shortcutText: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.88)',
    fontWeight: THEME.typography.weight.medium as '500',
  },
  sectionLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: THEME.spacing[12],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  suggestionRow: {
    gap: THEME.spacing[12],
    paddingRight: THEME.spacing[16],
    marginBottom: THEME.spacing[24],
  },
  previewCard: {
    borderRadius: 16,
    padding: THEME.spacing[16],
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewLabel: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  previewText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.white,
    lineHeight: 22,
    marginBottom: THEME.spacing[8],
  },
  previewHint: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 18,
  },
  fullLoaderScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: 48,
  },
  fullLoaderPanel: {
    width: '100%',
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: THEME.spacing[24],
    paddingHorizontal: THEME.spacing[16],
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  loaderWrap: {
    marginTop: THEME.spacing[8],
  },
  loaderPanel: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[14],
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  loaderTitle: {
    color: '#E2E8F0',
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold as '600',
    textAlign: 'center',
  },
  loaderSubTitle: {
    color: 'rgba(226,232,240,0.8)',
    fontSize: THEME.typography.size[14],
    textAlign: 'center',
  },
  loaderOrb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.65)',
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing[4],
  },
  responseBlock: {
    marginTop: THEME.spacing[10],
    gap: THEME.spacing[8],
  },
  responseText: {
    fontSize: THEME.typography.size[14],
    color: 'rgba(248,250,252,0.92)',
    lineHeight: 22,
  },
  dockHost: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
