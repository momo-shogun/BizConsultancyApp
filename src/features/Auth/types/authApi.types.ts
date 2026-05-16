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

export interface VerifyOtpDto {
  mobile: string;
  otp: string;
  role: AuthRole;
}

export interface VerifyOtpAuthDto {
  access_token?: string;
  accessToken?: string;
  refresh_token?: string;
  refreshToken?: string;
  expiresIn?: number;
  expires_in?: number;
  user?: PhoneAuthUserDto;
}

/** Flexible API shape — parser normalizes nested/token field names. */
export interface VerifyOtpResponseDto {
  valid?: boolean;
  role?: AuthRole;
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  expires_in?: number;
  user?: PhoneAuthUserDto;
  auth?: VerifyOtpAuthDto;
  data?: VerifyOtpResponseDto | PhoneAuthUserDto;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  expires_in?: number;
  auth?: VerifyOtpAuthDto;
}
