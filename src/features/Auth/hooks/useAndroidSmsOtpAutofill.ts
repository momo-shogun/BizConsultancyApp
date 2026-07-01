import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
  addSmsListener,
  extractOtp,
  getAppSignature,
  removeSmsListener,
  startSmsRetriever,
} from '@pushpendersingh/react-native-otp-verify';

const OTP_LENGTH = 6;

export interface UseAndroidSmsOtpAutofillOptions {
  enabled: boolean;
  restartKey?: number;
  onOtp: (otp: string) => void;
}

export function useAndroidSmsOtpAutofill(options: UseAndroidSmsOtpAutofillOptions): void {
  const { enabled, restartKey = 0, onOtp } = options;
  const onOtpRef = useRef(onOtp);

  useEffect(() => {
    onOtpRef.current = onOtp;
  }, [onOtp]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !enabled) {
      return;
    }

    let subscription: ReturnType<typeof addSmsListener> | null = null;
    let cancelled = false;

    const setup = async (): Promise<void> => {
      try {
        if (__DEV__) {
          const signature = await getAppSignature();
          console.log(
            '[SMS Retriever] App signature — set ANDROID_SMS_APP_HASH_DEBUG (or _RELEASE) on the API:',
            signature,
          );
        }

        subscription = addSmsListener((message) => {
          if (message.status !== 'success' || message.message == null) {
            return;
          }

          const otp = extractOtp(message.message, OTP_LENGTH);
          if (otp != null) {
            onOtpRef.current(otp);
          }
        });

        await startSmsRetriever();
      } catch (error: unknown) {
        if (!cancelled) {
          console.warn('[SMS Retriever] Failed to start listener:', error);
        }
      }
    };

    void setup();

    return () => {
      cancelled = true;
      subscription?.remove();
      void removeSmsListener().catch(() => undefined);
    };
  }, [enabled, restartKey]);
}
