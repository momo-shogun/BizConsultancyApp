import { useCallback, useEffect, useRef } from 'react';
import { useOtpListener } from '@avasapp/react-native-otp-autofill';

import { useOtpAutoSubmit } from './useOtpAutoSubmit';
import {
  OTP_LENGTH,
  type UseOtpAutofillOptions,
  type UseOtpAutofillResult,
} from './useOtpAutofill.types';

export type { UseOtpAutofillOptions, UseOtpAutofillResult } from './useOtpAutofill.types';

function normalizeOtp(value: string): string {
  return value.replace(/\D/g, '').slice(0, OTP_LENGTH);
}

export function useOtpAutofill(options: UseOtpAutofillOptions): UseOtpAutofillResult {
  const { otp, enabled = true, onOtpFilled, onOtpComplete } = options;
  const onOtpFilledRef = useRef(onOtpFilled);

  onOtpFilledRef.current = onOtpFilled;

  const startListenerRef = useRef<(() => Promise<void>) | null>(null);

  const { receivedOtp, startListener, stopListener } = useOtpListener({
    onOtpReceived: (receivedOtpValue) => {
      const cleaned = normalizeOtp(receivedOtpValue);
      if (cleaned.length === OTP_LENGTH) {
        onOtpFilledRef.current(cleaned);
      }
    },
    onTimeout: () => {
      if (enabled) {
        void startListenerRef.current?.();
      }
    },
  });

  startListenerRef.current = startListener;

  useOtpAutoSubmit(otp, enabled, onOtpComplete);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void startListener();

    return () => {
      stopListener();
    };
  }, [enabled, startListener, stopListener]);

  useEffect(() => {
    if (!enabled || receivedOtp == null) {
      return;
    }

    const cleaned = normalizeOtp(receivedOtp);
    if (cleaned.length === OTP_LENGTH) {
      onOtpFilledRef.current(cleaned);
    }
  }, [enabled, receivedOtp]);

  const restartSmsListener = useCallback((): void => {
    stopListener();
    void startListener();
  }, [startListener, stopListener]);

  return { restartSmsListener };
}
