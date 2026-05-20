import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Voice, {
  type SpeechErrorEvent,
  type SpeechResultsEvent,
} from '@react-native-voice/voice';

import type { BizAIVoiceStatus } from '../types/bizAiInput.types';
import {
  ensureBizAIMicrophonePermission,
  hasBizAIMicrophonePermission,
} from '../utils/bizAiMicrophonePermission';

type UseBizAIVoiceInputResult = {
  status: BizAIVoiceStatus;
  partialText: string;
  errorMessage: string | null;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
  prepareMicrophonePermission: () => Promise<void>;
};

export function useBizAIVoiceInput(
  onTranscript: (text: string, isFinal: boolean) => void,
): UseBizAIVoiceInputResult {
  const [status, setStatus] = useState<BizAIVoiceStatus>('idle');
  const [partialText, setPartialText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isBusyRef = useRef(false);

  const handleResults = useCallback(
    (event: SpeechResultsEvent): void => {
      const value = event.value?.[0]?.trim();
      if (!value) {
        return;
      }
      setPartialText(value);
      onTranscript(value, true);
      setStatus('idle');
    },
    [onTranscript],
  );

  const handlePartial = useCallback(
    (event: SpeechResultsEvent): void => {
      const value = event.value?.[0]?.trim();
      if (!value) {
        return;
      }
      setPartialText(value);
      onTranscript(value, false);
    },
    [onTranscript],
  );

  const handleError = useCallback((event: SpeechErrorEvent): void => {
    if (!isMountedRef.current) {
      return;
    }
    setStatus('error');
    setErrorMessage(event.error?.message ?? 'Voice input failed. Try again or use the keyboard.');
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    Voice.onSpeechStart = () => {
      if (!isMountedRef.current) {
        return;
      }
      setStatus('listening');
      setErrorMessage(null);
    };
    Voice.onSpeechEnd = () => {
      if (!isMountedRef.current) {
        return;
      }
      setStatus((prev) => (prev === 'listening' ? 'processing' : prev));
    };
    Voice.onSpeechResults = handleResults;
    Voice.onSpeechPartialResults = handlePartial;
    Voice.onSpeechError = handleError;

    return () => {
      isMountedRef.current = false;
      void Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, [handleError, handlePartial, handleResults]);

  const prepareMicrophonePermission = useCallback(async (): Promise<void> => {
    await ensureBizAIMicrophonePermission();
  }, []);

  const stopListening = useCallback(async (): Promise<void> => {
    try {
      await Voice.stop();
    } catch {
      // Already stopped.
    } finally {
      if (isMountedRef.current) {
        setStatus('idle');
      }
    }
  }, []);

  const startListening = useCallback(async (): Promise<void> => {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;

    try {
      const allowed = await ensureBizAIMicrophonePermission();
      if (!allowed) {
        const hasPermission = await hasBizAIMicrophonePermission();
        setStatus('error');
        setErrorMessage(
          hasPermission
            ? 'Could not access the microphone. Try again.'
            : 'Microphone permission is required. Allow access when prompted, then tap the mic again.',
        );
        return;
      }

      setPartialText('');
      setErrorMessage(null);
      setStatus('listening');

      const isAvailable = await Voice.isAvailable();
      if (isAvailable !== 1) {
        setStatus('error');
        setErrorMessage('Voice input is not available on this device. Use the keyboard instead.');
        return;
      }

      try {
        await Voice.cancel();
      } catch {
        // No active session.
      }
      await Voice.start(Platform.OS === 'ios' ? 'en-IN' : 'en-US');
    } catch {
      if (isMountedRef.current) {
        setStatus('error');
        setErrorMessage('Could not start voice input. Allow microphone access and try again.');
      }
    } finally {
      isBusyRef.current = false;
    }
  }, []);

  const toggleListening = useCallback(async (): Promise<void> => {
    try {
      if (status === 'listening' || status === 'processing') {
        await stopListening();
        return;
      }
      await startListening();
    } catch {
      if (isMountedRef.current) {
        setStatus('error');
        setErrorMessage('Voice input failed. Try again or use the keyboard.');
      }
    }
  }, [startListening, status, stopListening]);

  return {
    status,
    partialText,
    errorMessage,
    isListening: status === 'listening',
    startListening,
    stopListening,
    toggleListening,
    prepareMicrophonePermission,
  };
}
