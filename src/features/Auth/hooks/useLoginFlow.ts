import { useCallback, useState } from 'react';

import { useAuth } from '@/app/providers/AuthProvider';
import { useSendOtpMutation, useVerifyNumberMutation } from '@/features/Auth/api/authApi';
import { setLoginSession } from '@/features/Auth/store/authSlice';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { useAppDispatch } from '@/store/typedHooks';

function getErrorMessage(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
  }
  if (error != null && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (status === 'FETCH_ERROR') {
      return 'Network error. Check your connection and API URL.';
    }
  }
  return 'Something went wrong. Please try again.';
}

export interface UseLoginFlowResult {
  submitMobile: (mobile: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useLoginFlow(): UseLoginFlowResult {
  const dispatch = useAppDispatch();
  const { state } = useAuth();
  const [verifyNumber, verifyState] = useVerifyNumberMutation();
  const [sendOtp, sendOtpState] = useSendOtpMutation();
  const [error, setError] = useState<string | null>(null);

  const role = state.userType as AuthRole | null;
  const isLoading = verifyState.isLoading || sendOtpState.isLoading;

  const submitMobile = useCallback(
    async (mobile: string): Promise<boolean> => {
      if (role == null) {
        setError('Please choose account type first.');
        return false;
      }

      setError(null);

      try {
        const verifyResult = await verifyNumber({ mobile, role }).unwrap();

        dispatch(
          setLoginSession({
            mobile,
            role,
            isRegistered: verifyResult.verified,
          }),
        );

        const otpResult = await sendOtp({ mobile }).unwrap();

        if (!otpResult.sent) {
          setError('Could not send OTP. Please try again.');
          return false;
        }

        return true;
      } catch (err: unknown) {
        console.log('[Login API] login flow failed', err);
        setError(getErrorMessage(err));
        return false;
      }
    },
    [dispatch, role, sendOtp, verifyNumber],
  );

  return {
    submitMobile,
    isLoading,
    error,
  };
}
