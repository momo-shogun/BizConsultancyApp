export type AuthRole = 'user' | 'consultant';

export interface PhoneAuthUserDto {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string | null;
  userType: AuthRole | 'admin' | string | null;
}

export interface VerifyNumberDto {
  mobile: string;
  role: AuthRole;
}

export interface VerifyNumberResponseDto {
  verified: boolean;
  user?: PhoneAuthUserDto;
}

export interface SendOtpDto {
  mobile: string;
}

export interface SendOtpResponseDto {
  sent: boolean;
}
