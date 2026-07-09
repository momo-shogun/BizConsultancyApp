export const OTP_LENGTH = 6;

export interface UseOtpAutofillOptions {
  otp: string;
  enabled?: boolean;
  onOtpFilled: (otp: string) => void;
  onOtpComplete: (otp: string) => void;
}

export interface UseOtpAutofillResult {
  restartSmsListener: () => void;
}
