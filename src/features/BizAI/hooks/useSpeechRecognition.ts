import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  type ExpoSpeechRecognitionErrorCode,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from 'expo-speech-recognition';

import {
  SPEECH_ACTIVE_VOLUME_THRESHOLD,
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
  volumeThreshold?: number;
}

export interface UseSpeechRecognitionResult {
  isAvailable: boolean;
  isListening: boolean;
  isPermissionGranted: boolean;
  isRequestingPermission: boolean;
  transcript: string;
  partialTranscript: string;
  volume: number;
  /** Ms that volume has stayed below the active threshold while listening. */
  msSinceLowVolume: number;
  errorMessage: string | null;
  errorCode: ExpoSpeechRecognitionErrorCode | 'unknown' | null;
  canRetryPermission: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  abortListening: () => void;
  clearError: () => void;
  clearTranscript: () => void;
}

const BENIGN_SPEECH_ERROR_CODES = new Set<string>([
  'no-speech',
  'speech-timeout',
  'aborted',
  'canceled',
  'cancelled',
]);

/** Errors that should never surface in the voice UI (expected stop / silence / retry). */
function isBenignSpeechError(code: ExpoSpeechRecognitionErrorCode | 'unknown'): boolean {
  if (BENIGN_SPEECH_ERROR_CODES.has(code)) {
    return true;
  }
  return code === 'unknown' || code === 'network' || code === 'busy';
}

function messageForBlockingErrorCode(code: ExpoSpeechRecognitionErrorCode | 'unknown'): string | null {
  if (code === 'not-allowed') {
    return 'Microphone permission is required. Allow it in Settings to use voice.';
  }
  if (code === 'service-not-allowed') {
    return 'Speech recognition is unavailable on this device.';
  }
  if (code === 'language-not-supported') {
    return 'This speech language is not supported on your device.';
  }
  return null;
}

function isVolumeActive(value: number, threshold: number): boolean {
  return value >= threshold;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionResult {
  const locale = options.locale ?? 'en-US';
  const continuous = options.continuous ?? true;
  const interimResults = options.interimResults ?? true;
  const silenceTimeoutMs = options.silenceTimeoutMs ?? SPEECH_SILENCE_TIMEOUT_MS;
  const volumeThreshold = options.volumeThreshold ?? SPEECH_ACTIVE_VOLUME_THRESHOLD;

  const [isListening, setIsListening] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [canRetryPermission, setCanRetryPermission] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [volume, setVolume] = useState(-2);
  const [msSinceLowVolume, setMsSinceLowVolume] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ExpoSpeechRecognitionErrorCode | 'unknown' | null>(null);

  const retryCountRef = useRef(0);
  const lowVolumeSinceRef = useRef<number | null>(null);
  const lastResultTextRef = useRef('');
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isListeningRef = useRef(false);
  const stoppingIntentionallyRef = useRef(false);

  const diagnostics = useMemo(() => getSpeechDiagnostics(), []);

  const resetLowVolumeTimer = useCallback((): void => {
    lowVolumeSinceRef.current = null;
    setMsSinceLowVolume(0);
  }, []);

  const startLowVolumeTimer = useCallback((): void => {
    if (lowVolumeSinceRef.current == null) {
      lowVolumeSinceRef.current = Date.now();
    }
  }, []);

  const clearError = useCallback((): void => {
    setErrorMessage(null);
    setErrorCode(null);
  }, []);

  const clearTranscript = useCallback((): void => {
    setTranscript('');
    setPartialTranscript('');
    lastResultTextRef.current = '';
    resetLowVolumeTimer();
  }, [resetLowVolumeTimer]);

  const stopListening = useCallback((): void => {
    stoppingIntentionallyRef.current = true;
    clearError();
    stopSpeechRecognition();
  }, [clearError]);

  const abortListening = useCallback((): void => {
    stoppingIntentionallyRef.current = true;
    clearError();
    abortSpeechRecognition();
  }, [clearError]);

  const startListening = useCallback(async (): Promise<void> => {
    clearError();
    if (!diagnostics.isRecognitionAvailable) {
      setErrorCode('service-not-allowed');
      setErrorMessage(messageForBlockingErrorCode('service-not-allowed'));
      return;
    }
    if (isListeningRef.current) {
      return;
    }

    let permission = await getSpeechPermissionState();
    if (!permission.granted) {
      if (!permission.canAskAgain || permission.restricted) {
        setCanRetryPermission(false);
        setErrorCode('not-allowed');
        setErrorMessage(messageForBlockingErrorCode('not-allowed'));
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
      setErrorMessage(messageForBlockingErrorCode('not-allowed'));
      return;
    }

    stoppingIntentionallyRef.current = false;
    retryCountRef.current = 0;
    setPartialTranscript('');
    setVolume(-2);
    lastResultTextRef.current = '';
    lowVolumeSinceRef.current = Date.now();
    setMsSinceLowVolume(0);
    startSpeechRecognition({
      locale,
      continuous,
      interimResults,
      silenceMs: silenceTimeoutMs,
      onDevice: Platform.OS === 'ios',
    });
  }, [
    clearError,
    diagnostics.isRecognitionAvailable,
    locale,
    continuous,
    interimResults,
    silenceTimeoutMs,
  ]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    void getSpeechPermissionState().then((permission) => {
      setIsPermissionGranted(permission.granted);
      setCanRetryPermission(permission.canAskAgain);
    });
  }, []);

  useEffect(() => {
    if (!isListening) {
      return;
    }

    const tick = setInterval(() => {
      if (lowVolumeSinceRef.current == null) {
        setMsSinceLowVolume(0);
        return;
      }
      const elapsed = Date.now() - lowVolumeSinceRef.current;
      setMsSinceLowVolume(elapsed);
      if (elapsed >= silenceTimeoutMs) {
        stopListening();
      }
    }, 200);

    return () => {
      clearInterval(tick);
    };
  }, [isListening, silenceTimeoutMs, stopListening]);

  useEffect(() => {
    const onStart = ExpoSpeechRecognitionModule.addListener('start', () => {
      setIsListening(true);
      clearError();
      lowVolumeSinceRef.current = Date.now();
      setMsSinceLowVolume(0);
    });

    const onResult = ExpoSpeechRecognitionModule.addListener(
      'result',
      (event: ExpoSpeechRecognitionResultEvent) => {
        const text = event.results[0]?.transcript?.trim() ?? '';
        if (text.length === 0) {
          return;
        }
        if (text !== lastResultTextRef.current) {
          lastResultTextRef.current = text;
          resetLowVolumeTimer();
        }
        if (event.isFinal) {
          setTranscript((prev) => (prev.length > 0 ? `${prev}\n${text}` : text));
          setPartialTranscript('');
        } else {
          setPartialTranscript(text);
        }
      },
    );

    const onVolume = ExpoSpeechRecognitionModule.addListener('volumechange', (event) => {
      setVolume(event.value);
      if (!isListeningRef.current) {
        return;
      }
      if (isVolumeActive(event.value, volumeThreshold)) {
        resetLowVolumeTimer();
        return;
      }
      startLowVolumeTimer();
    });

    const onError = ExpoSpeechRecognitionModule.addListener(
      'error',
      (event: ExpoSpeechRecognitionErrorEvent) => {
        const code = normalizeSpeechErrorCode(event.error);
        if (
          stoppingIntentionallyRef.current ||
          isBenignSpeechError(code)
        ) {
          stoppingIntentionallyRef.current = false;
          clearError();
          return;
        }
        if (code === 'busy' && retryCountRef.current < SPEECH_MAX_RETRIES) {
          retryCountRef.current += 1;
          lowVolumeSinceRef.current = Date.now();
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
        const blockingMessage = messageForBlockingErrorCode(code);
        if (blockingMessage == null) {
          clearError();
          return;
        }
        setErrorCode(code);
        setErrorMessage(blockingMessage);
      },
    );

    const onEnd = ExpoSpeechRecognitionModule.addListener('end', () => {
      setIsListening(false);
      retryCountRef.current = 0;
      stoppingIntentionallyRef.current = false;
      clearError();
      resetLowVolumeTimer();
    });

    return () => {
      onStart.remove();
      onResult.remove();
      onVolume.remove();
      onError.remove();
      onEnd.remove();
    };
  }, [
    clearError,
    continuous,
    interimResults,
    locale,
    resetLowVolumeTimer,
    silenceTimeoutMs,
    startLowVolumeTimer,
    volumeThreshold,
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
    msSinceLowVolume,
    errorMessage,
    errorCode,
    canRetryPermission,
    startListening,
    stopListening,
    abortListening,
    clearError,
    clearTranscript,
  };
}
