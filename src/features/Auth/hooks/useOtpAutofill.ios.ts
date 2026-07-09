import { useCallback } from 'react';

import { useOtpAutoSubmit } from './useOtpAutoSubmit';
import type { UseOtpAutofillOptions, UseOtpAutofillResult } from './useOtpAutofill.types';

export type { UseOtpAutofillOptions, UseOtpAutofillResult } from './useOtpAutofill.types';

export function useOtpAutofill(options: UseOtpAutofillOptions): UseOtpAutofillResult {
  const { otp, enabled = true, onOtpComplete } = options;

  useOtpAutoSubmit(otp, enabled, onOtpComplete);

  const restartSmsListener = useCallback((): void => {
    // iOS uses native oneTimeCode autofill via TextInput.
  }, []);

  return { restartSmsListener };
}
