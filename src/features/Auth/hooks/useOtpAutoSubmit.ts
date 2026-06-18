import { useEffect, useRef } from 'react';

import { OTP_LENGTH } from './useOtpAutofill.types';

export function useOtpAutoSubmit(
  otp: string,
  enabled: boolean,
  onOtpComplete: (otp: string) => void,
): void {
  const onOtpCompleteRef = useRef(onOtpComplete);
  const lastSubmittedOtpRef = useRef<string>('');

  onOtpCompleteRef.current = onOtpComplete;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (otp.length < OTP_LENGTH) {
      lastSubmittedOtpRef.current = '';
      return;
    }

    if (otp.length !== OTP_LENGTH || lastSubmittedOtpRef.current === otp) {
      return;
    }

    lastSubmittedOtpRef.current = otp;
    onOtpCompleteRef.current(otp);
  }, [enabled, otp]);
}
