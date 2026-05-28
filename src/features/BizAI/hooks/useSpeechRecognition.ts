import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  type ExpoSpeechRecognitionErrorCode,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from 'expo-speech-recognition';

import {
  SPEECH_MAX_RETRIES,
  SPEECH_SILENCE_TIMEOUT_MS,
  abortSpeechRecognition,
  getSpeechDiagnostics,
  getSpeechPermissionState,
  normalizeSpeechErrorCode,
  requestSpeechPermission,
  startSpeechRecognition,
  stopSpeechRecognition,
} from '../services/speechRecognitionService';

export interface UseSpeechRecognitionOptions {
  locale?: string;
  continuous?: boolean;
  interimResults?: boolean;
  silenceTimeoutMs?: number;
}

export interface UseSpeechRecognitionResult {
  isAvailable: boolean;
  isListening: boolean;
  isPermissionGranted: boolean;
  isRequestingPermission: boolean;
  transcript: string;
  partialTranscript: string;
  volume: number;
  errorMessage: string | null;
  errorCode: ExpoSpeechRecognitionErrorCode | 'unknown' | null;
  canRetryPermission: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  abortListening: () => void;
  clearError: () => void;
}

function messageForErrorCode(code: ExpoSpeechRecognitionErrorCode | 'unknown'): string {
  if (code === 'not-allowed') {
    return 'Microphone permission is required. Please allow it from settings.';
  }
  if (code === 'service-not-allowed') {
    return 'Speech service is unavailable on this device.';
  }
  if (code === 'language-not-supported') {
    return 'Selected speech language is not supported on this device.';
  }
  if (code === 'network') {
    return 'Network issue while processing speech. Please try again.';
  }
  if (code === 'no-speech' || code === 'speech-timeout') {
    return 'No speech detected. Please try speaking again.';
  }
  if (code === 'busy') {
    return 'Speech recognizer is busy. Retrying...';
  }
  return 'Voice recognition failed. Please try again.';
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionResult {
  const locale = options.locale ?? 'en-US';
  const continuous = options.continuous ?? true;
  const interimResults = options.interimResults ?? true;
  const silenceTimeoutMs = options.silenceTimeoutMs ?? SPEECH_SILENCE_TIMEOUT_MS;

  const [isListening, setIsListening] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [canRetryPermission, setCanRetryPermission] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [volume, setVolume] = useState(-2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ExpoSpeechRecognitionErrorCode | 'unknown' | null>(null);

  const retryCountRef = useRef(0);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const diagnostics = useMemo(() => getSpeechDiagnostics(), []);

  const clearSilenceTimer = useCallback((): void => {
    if (silenceTimerRef.current != null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const scheduleSilenceStop = useCallback((): void => {
    if (!continuous) {
      return;
    }
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      stopSpeechRecognition();
    }, silenceTimeoutMs);
  }, [clearSilenceTimer, continuous, silenceTimeoutMs]);

  const clearError = useCallback((): void => {
    setErrorMessage(null);
    setErrorCode(null);
  }, []);

  const stopListening = useCallback((): void => {
    clearSilenceTimer();
    stopSpeechRecognition();
  }, [clearSilenceTimer]);

  const abortListening = useCallback((): void => {
    clearSilenceTimer();
    abortSpeechRecognition();
  }, [clearSilenceTimer]);

  const startListening = useCallback(async (): Promise<void> => {
    clearError();
    if (!diagnostics.isRecognitionAvailable) {
      setErrorCode('service-not-allowed');
      setErrorMessage(messageForErrorCode('service-not-allowed'));
      return;
    }
    if (isListening) {
      return;
    }

    let permission = await getSpeechPermissionState();
    if (!permission.granted) {
      if (!permission.canAskAgain || permission.restricted) {
        setCanRetryPermission(false);
        setErrorCode('not-allowed');
        setErrorMessage(messageForErrorCode('not-allowed'));
        return;
      }
      setIsRequestingPermission(true);
      permission = await requestSpeechPermission();
      setIsRequestingPermission(false);
    }

    setIsPermissionGranted(permission.granted);
    setCanRetryPermission(permission.canAskAgain);
    if (!permission.granted) {
      setErrorCode('not-allowed');
      setErrorMessage(messageForErrorCode('not-allowed'));
      return;
    }

    retryCountRef.current = 0;
    setPartialTranscript('');
    setVolume(-2);
    startSpeechRecognition({
      locale,
      continuous,
      interimResults,
      silenceMs: silenceTimeoutMs,
      onDevice: Platform.OS === 'ios',
    });
    scheduleSilenceStop();
  }, [
    clearError,
    diagnostics.isRecognitionAvailable,
    isListening,
    locale,
    continuous,
    interimResults,
    silenceTimeoutMs,
    scheduleSilenceStop,
  ]);

  useEffect(() => {
    void getSpeechPermissionState().then((permission) => {
      setIsPermissionGranted(permission.granted);
      setCanRetryPermission(permission.canAskAgain);
    });
  }, []);

  useEffect(() => {
    const onStart = ExpoSpeechRecognitionModule.addListener('start', () => {
      setIsListening(true);
      clearError();
      scheduleSilenceStop();
    });

    const onResult = ExpoSpeechRecognitionModule.addListener(
      'result',
      (event: ExpoSpeechRecognitionResultEvent) => {
        const text = event.results[0]?.transcript?.trim() ?? '';
        if (text.length === 0) {
          return;
        }
        if (event.isFinal) {
          setTranscript((prev) => (prev.length > 0 ? `${prev}\n${text}` : text));
          setPartialTranscript('');
        } else {
          setPartialTranscript(text);
        }
        scheduleSilenceStop();
      },
    );

    const onVolume = ExpoSpeechRecognitionModule.addListener('volumechange', (event) => {
      setVolume(event.value);
      scheduleSilenceStop();
    });

    const onError = ExpoSpeechRecognitionModule.addListener(
      'error',
      (event: ExpoSpeechRecognitionErrorEvent) => {
        const code = normalizeSpeechErrorCode(event.error);
        if (code === 'busy' && retryCountRef.current < SPEECH_MAX_RETRIES) {
          retryCountRef.current += 1;
          setTimeout(() => {
            startSpeechRecognition({
              locale,
              continuous,
              interimResults,
              silenceMs: silenceTimeoutMs,
              onDevice: Platform.OS === 'ios',
            });
          }, 280);
          return;
        }
        setErrorCode(code);
        setErrorMessage(messageForErrorCode(code));
      },
    );

    const onEnd = ExpoSpeechRecognitionModule.addListener('end', () => {
      setIsListening(false);
      clearSilenceTimer();
      retryCountRef.current = 0;
    });

    return () => {
      onStart.remove();
      onResult.remove();
      onVolume.remove();
      onError.remove();
      onEnd.remove();
      clearSilenceTimer();
    };
  }, [
    clearError,
    clearSilenceTimer,
    continuous,
    interimResults,
    locale,
    scheduleSilenceStop,
    silenceTimeoutMs,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appStateRef.current === 'active';
      appStateRef.current = nextState;
      if (wasActive && nextState !== 'active') {
        abortListening();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [abortListening]);

  useEffect(() => {
    return () => {
      abortListening();
    };
  }, [abortListening]);

  return {
    isAvailable: diagnostics.isRecognitionAvailable,
    isListening,
    isPermissionGranted,
    isRequestingPermission,
    transcript,
    partialTranscript,
    volume,
    errorMessage,
    errorCode,
    canRetryPermission,
    startListening,
    stopListening,
    abortListening,
    clearError,
  };
}
