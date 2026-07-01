import { useCallback, useRef, useState } from 'react';

import { useAndroidSmsOtpAutofill } from './useAndroidSmsOtpAutofill';
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
  const [restartKey, setRestartKey] = useState<number>(0);

  onOtpFilledRef.current = onOtpFilled;

  useAndroidSmsOtpAutofill({
    enabled,
    restartKey,
    onOtp: (value) => {
      onOtpFilledRef.current(normalizeOtp(value));
    },
  });

  useOtpAutoSubmit(otp, enabled, onOtpComplete);

  const restartSmsListener = useCallback((): void => {
    setRestartKey((key) => key + 1);
  }, []);

  return { restartSmsListener };
}
