import { useCallback, useState } from 'react';

import { useSendOtpMutation, useVerifyNumberMutation } from '@/features/Auth/api/authApi';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { getApiErrorMessage } from '@/utils/apiError';

export type SignupVerifyResult = 'already_registered' | 'otp_sent' | false;

export interface UseSignupFlowResult {
  verifyAndSendOtp: (mobile: string, role: AuthRole) => Promise<SignupVerifyResult>;
  resendOtp: (mobile: string) => Promise<boolean>;
  isVerifyingMobile: boolean;
  isResendingOtp: boolean;
  error: string | null;
  clearError: () => void;
}

export function useSignupFlow(): UseSignupFlowResult {
  const [verifyNumber, verifyState] = useVerifyNumberMutation();
  const [sendOtp, sendOtpState] = useSendOtpMutation();
  const [error, setError] = useState<string | null>(null);

  const verifyAndSendOtp = useCallback(
    async (mobile: string, role: AuthRole): Promise<SignupVerifyResult> => {
      setError(null);

      try {
        const verifyResult = await verifyNumber({ mobile, role }).unwrap();

        if (verifyResult.verified) {
          return 'already_registered';
        }

        const otpResult = await sendOtp({ mobile }).unwrap();

        if (!otpResult.sent) {
          setError('Could not send OTP. Please try again.');
          return false;
        }

        return 'otp_sent';
      } catch (err: unknown) {
        setError(getApiErrorMessage(err));
        return false;
      }
    },
    [sendOtp, verifyNumber],
  );

  const resendOtp = useCallback(
    async (mobile: string): Promise<boolean> => {
      setError(null);

      try {
        const otpResult = await sendOtp({ mobile }).unwrap();

        if (!otpResult.sent) {
          setError('Could not resend OTP. Please try again.');
          return false;
        }

        return true;
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Could not resend OTP. Please try again.'));
        return false;
      }
    },
    [sendOtp],
  );

  return {
    verifyAndSendOtp,
    resendOtp,
    isVerifyingMobile: verifyState.isLoading || sendOtpState.isLoading,
    isResendingOtp: sendOtpState.isLoading,
    error,
    clearError: () => setError(null),
  };
}
