import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { BizAIChatThread } from '../components/BizAIChatThread';
import { BizAIHeader } from '../components/BizAIHeader';
import { BizAIKeyboardComposer } from '../components/BizAIKeyboardComposer';
import { BizAILoadingPanel } from '../components/BizAILoadingPanel';
import { BizAIShortcutPill } from '../components/BizAIShortcutPill';
import { BizAISpeechStatusPanel } from '../components/BizAISpeechStatusPanel';
import { BizAISuggestionChip } from '../components/BizAISuggestionChip';
import { BizAIVoiceDock } from '../components/BizAIVoiceDock';
import {
  BIZ_AI_GREETINGS,
  BIZ_AI_SHORTCUTS,
  BIZ_AI_SUGGESTIONS,
} from '../constants/bizAiSuggestions';
import { BIZ_AI_THEME } from '../constants/bizAiTheme';
import { useBizAIChat } from '../hooks/useBizAIChat';
import { useBizAIKeyboardInset } from '../hooks/useBizAIKeyboardInset';
import { useBizAIThinkingStep } from '../hooks/useBizAIThinkingStep';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { BizAIInputMode } from '../types/bizAiInput.types';

const VOICE_DOCK_HEIGHT = 176;
const KEYBOARD_DOCK_HEIGHT = 72;
const SPEECH_PANEL_HEIGHT = 132;
const SPEECH_SILENCE_MS = 4000;

type BizAIRouteProp = RouteProp<RootStackParamList, typeof ROUTES.Root.BizAI>;

export function BizAIScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BizAIRouteProp>();
  const insets = useSafeAreaInsets();
  const { keyboardHeight } = useBizAIKeyboardInset();

  const initialInputMode = route.params?.initialInputMode ?? 'keyboard';
  const [inputMode, setInputMode] = useState<BizAIInputMode>(initialInputMode);
  const didApplyLaunchModeRef = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState<string>('');

  const {
    messages,
    pendingQuery,
    relatedQuestions,
    isAwaitingResponse,
    usageBadgeLabel,
    hasChatHistory,
    sendMessage,
  } = useBizAIChat();

  const speech = useSpeechRecognition({
    locale: 'en-US',
    continuous: true,
    interimResults: true,
    silenceTimeoutMs: SPEECH_SILENCE_MS,
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
    msSinceLowVolume: speechMsSinceLowVolume,
    errorMessage: speechErrorMessage,
    clearTranscript,
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

  const onSuggestionPress = useCallback(
    (prompt: string): void => {
      setDraft(prompt);
      void sendMessage(prompt);
    },
    [sendMessage],
  );

  const onRelatedQuestionPress = useCallback(
    (prompt: string): void => {
      setDraft(prompt);
      void sendMessage(prompt);
    },
    [sendMessage],
  );

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
    Keyboard.dismiss();
    void sendMessage(trimmed);
    setDraft('');
  }, [draft, sendMessage]);

  const onVoiceSend = useCallback((): void => {
    if (isSpeechListening) {
      stopListening();
    }
    clearTranscript();
    onSend();
  }, [clearTranscript, isSpeechListening, onSend, stopListening]);

  useEffect(() => {
    if (didApplyLaunchModeRef.current) {
      return;
    }
    const launchMode = route.params?.initialInputMode;
    if (launchMode == null) {
      return;
    }
    didApplyLaunchModeRef.current = true;
    setInputMode(launchMode);
    if (launchMode !== 'voice' || !isSpeechAvailable) {
      return;
    }
    const timer = setTimeout(() => {
      void startListening();
    }, 360);
    return () => clearTimeout(timer);
  }, [isSpeechAvailable, route.params?.initialInputMode, startListening]);

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
    if (messages.length === 0 && pendingQuery == null) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages, pendingQuery, isAwaitingResponse]);

  const thinkingStepIndex = useBizAIThinkingStep(isAwaitingResponse);
  const hasAssistantReply = messages.some((row) => row.role === 'assistant');
  const showPendingLoader = isAwaitingResponse && pendingQuery != null;
  const showFullScreenLoader = showPendingLoader && !hasAssistantReply;
  const showInlineLoader = showPendingLoader && hasAssistantReply;
  const showFollowUps =
    hasChatHistory && relatedQuestions.length > 0 && !isAwaitingResponse;
  const showVoiceSpeechPanel =
    !showPendingLoader && inputMode === 'voice' && (!hasChatHistory || isSpeechListening);

  const bottomPad =
    inputMode === 'voice'
      ? insets.bottom +
        VOICE_DOCK_HEIGHT +
        (showVoiceSpeechPanel ? SPEECH_PANEL_HEIGHT : 0)
      : insets.bottom + KEYBOARD_DOCK_HEIGHT + 24;

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={BIZ_AI_THEME.bg.base}
      contentBgColor={BIZ_AI_THEME.bg.base}
      statusBarStyle="light-content"
      style={styles.root}
    >
      <LinearGradient
        colors={[...BIZ_AI_THEME.gradient.screen]}
        locations={[...BIZ_AI_THEME.gradient.screenLocations]}
        style={StyleSheet.absoluteFill}
      />

      <BizAIHeader onClose={close} usageBadgeLabel={usageBadgeLabel} />

      {showFullScreenLoader && pendingQuery != null ? (
        <BizAILoadingPanel query={pendingQuery} stepIndex={thinkingStepIndex} />
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        >
          {hasChatHistory ? (
            <>
              <BizAIChatThread messages={messages} />
              {showInlineLoader && pendingQuery != null ? (
                <View style={styles.inlineLoader}>
                  <BizAILoadingPanel
                    query={pendingQuery}
                    stepIndex={thinkingStepIndex}
                    compact
                  />
                </View>
              ) : null}
              {showFollowUps ? (
                <View style={styles.followUpBlock}>
                  <Text style={styles.followUpTitle}>Related questions</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.followUpRow}
                    decelerationRate="fast"
                  >
                    {relatedQuestions.map((item, index) => (
                      <BizAISuggestionChip
                        key={item}
                        item={{
                          id: item,
                          label: item,
                          prompt: item,
                          icon: 'bulb-outline',
                        }}
                        index={index}
                        onPress={() => onRelatedQuestionPress(item)}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <Animated.View entering={FadeInDown.duration(260)} style={styles.hero}>
                <Text style={styles.greeting} accessibilityRole="header">
                  {greeting}
                </Text>
                <Text style={styles.subGreeting}>
                  Ask in English, Hindi, or Hinglish about services, bookings, membership, and
                  compliance — powered by the same Biz Assistant as the portal.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(60).duration(240)} style={styles.shortcutRow}>
                {BIZ_AI_SHORTCUTS.map((item) => (
                  <BizAIShortcutPill
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    onPress={() => onShortcutPress(item.id)}
                  />
                ))}
              </Animated.View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Quick suggestions</Text>
                <Text style={styles.sectionHint}>Tap to ask</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionRow}
                decelerationRate="fast"
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
            </>
          )}
        </ScrollView>
      )}

      {!showFullScreenLoader && showVoiceSpeechPanel ? (
        <BizAISpeechStatusPanel
          isListening={isSpeechListening}
          transcript={speechTranscript}
          partialTranscript={speechPartialTranscript}
          volume={speechVolume}
          msSinceLowVolume={speechMsSinceLowVolume}
          silenceTimeoutMs={SPEECH_SILENCE_MS}
          errorMessage={speechErrorMessage}
          bottomInset={insets.bottom + VOICE_DOCK_HEIGHT - 8}
          onSend={onVoiceSend}
        />
      ) : null}

      {!showFullScreenLoader &&
        (inputMode === 'voice' ? (
          <View style={[styles.dockHost, { paddingBottom: insets.bottom }]}>
            <BizAIVoiceDock
              onKeyboardPress={openKeyboardMode}
              onMicPress={onMicPress}
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
    backgroundColor: BIZ_AI_THEME.bg.base,
  },
  scroll: {
    paddingHorizontal: BIZ_AI_THEME.spacing.screenX,
    paddingTop: THEME.spacing[16],
  },
  hero: {
    marginBottom: BIZ_AI_THEME.spacing.section,
  },
  greeting: {
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold as '700',
    color: BIZ_AI_THEME.text.primary,
    lineHeight: 36,
    letterSpacing: -0.4,
    marginBottom: THEME.spacing[10],
  },
  subGreeting: {
    fontSize: THEME.typography.size[14],
    color: BIZ_AI_THEME.text.secondary,
    lineHeight: 22,
    maxWidth: 320,
  },
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
    marginBottom: BIZ_AI_THEME.spacing.section,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[14],
  },
  sectionLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: BIZ_AI_THEME.text.muted,
    letterSpacing: 0.4,
  },
  sectionHint: {
    fontSize: THEME.typography.size[12],
    color: BIZ_AI_THEME.text.faint,
  },
  suggestionRow: {
    gap: THEME.spacing[12],
    paddingRight: BIZ_AI_THEME.spacing.screenX,
    marginBottom: BIZ_AI_THEME.spacing.section,
  },
  followUpBlock: {
    marginTop: THEME.spacing[14],
    gap: THEME.spacing[10],
  },
  followUpTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: BIZ_AI_THEME.text.muted,
    letterSpacing: 0.3,
  },
  followUpRow: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
    paddingRight: BIZ_AI_THEME.spacing.screenX,
  },
  inlineLoader: {
    marginTop: THEME.spacing[4],
  },
  dockHost: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
