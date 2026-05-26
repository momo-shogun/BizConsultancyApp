import type { Asset } from 'react-native-image-picker';

export type UserGenderValue = 'male' | 'female' | 'other' | '';

export interface UserMeDto {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gender: UserGenderValue;
  thumbnail: string | null;
}

export interface UserProfileFormState {
  email: string;
  city: string;
  state: string;
  pincode: string;
  gender: UserGenderValue;
}

export interface UpdateUserProfilePayload {
  email: string;
  city: string;
  state: string;
  pincode: string;
  gender: UserGenderValue;
  imageAsset: Asset | null;
}
