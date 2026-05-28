import {
  ExpoSpeechRecognitionModule,
  type ExpoSpeechRecognitionErrorCode,
  type ExpoSpeechRecognitionOptions,
} from 'expo-speech-recognition';
import { Platform } from 'react-native';

export const SPEECH_MAX_RETRIES = 2;
export const SPEECH_SILENCE_TIMEOUT_MS = 5000;

export interface SpeechPermissionState {
  granted: boolean;
  canAskAgain: boolean;
  restricted: boolean;
}

export interface SpeechServiceDiagnostics {
  isRecognitionAvailable: boolean;
  supportsOnDeviceRecognition: boolean;
  defaultServicePackage?: string;
  availableServicePackages?: string[];
}

export interface SpeechStartParams {
  locale: string;
  continuous: boolean;
  interimResults: boolean;
  silenceMs?: number;
  onDevice?: boolean;
}

function toPermissionState(result: {
  granted: boolean;
  canAskAgain: boolean;
  restricted?: boolean;
}): SpeechPermissionState {
  return {
    granted: result.granted,
    canAskAgain: result.canAskAgain,
    restricted: result.restricted === true,
  };
}

export async function getSpeechPermissionState(): Promise<SpeechPermissionState> {
  const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
  return toPermissionState(result);
}

export async function requestSpeechPermission(): Promise<SpeechPermissionState> {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return toPermissionState(result);
}

export function getSpeechDiagnostics(): SpeechServiceDiagnostics {
  const diagnostics: SpeechServiceDiagnostics = {
    isRecognitionAvailable: ExpoSpeechRecognitionModule.isRecognitionAvailable(),
    supportsOnDeviceRecognition: ExpoSpeechRecognitionModule.supportsOnDeviceRecognition(),
  };

  if (Platform.OS === 'android') {
    diagnostics.availableServicePackages = ExpoSpeechRecognitionModule.getSpeechRecognitionServices();
    diagnostics.defaultServicePackage =
      ExpoSpeechRecognitionModule.getDefaultRecognitionService().packageName;
  }

  return diagnostics;
}

export function normalizeSpeechErrorCode(
  code: ExpoSpeechRecognitionErrorCode | string | null | undefined,
): ExpoSpeechRecognitionErrorCode | 'unknown' {
  if (code == null || code.trim().length === 0) {
    return 'unknown';
  }
  const normalized = code.trim() as ExpoSpeechRecognitionErrorCode;
  return normalized;
}

export function startSpeechRecognition(params: SpeechStartParams): void {
  const options: ExpoSpeechRecognitionOptions = {
    lang: params.locale,
    interimResults: params.interimResults,
    continuous: params.continuous,
    requiresOnDeviceRecognition: params.onDevice === true,
    volumeChangeEventOptions: {
      enabled: true,
      intervalMillis: 250,
    },
    androidIntentOptions:
      params.silenceMs != null
        ? {
            EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: params.silenceMs,
            EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: Math.max(
              1200,
              Math.floor(params.silenceMs * 0.5),
            ),
          }
        : undefined,
  };

  ExpoSpeechRecognitionModule.start(options);
}

export function stopSpeechRecognition(): void {
  ExpoSpeechRecognitionModule.stop();
}

export function abortSpeechRecognition(): void {
  ExpoSpeechRecognitionModule.abort();
}
