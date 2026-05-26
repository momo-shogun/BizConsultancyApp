import type { Asset } from 'react-native-image-picker';

export type ConsultantGenderValue = 'male' | 'female' | 'other' | 'prefer_not' | '';

export interface ConsultantMyProfileDto {
  name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gender: ConsultantGenderValue;
  thumbnail: string | null;
  experience: string | null;
  dob: string | null;
  address: string | null;
  audioFee: number | null;
  videoFee: number | null;
  highestQualification: string | null;
  profileSummary: string | null;
  bankName: string | null;
  branchName: string | null;
  accountName: string | null;
  accountNo: string | null;
  ifscCode: string | null;
}

export interface ConsultantProfileFormState {
  email: string;
  gender: ConsultantGenderValue;
  pincode: string;
  city: string;
  state: string;
  address: string;
  experience: string;
  dob: string;
  qualification: string;
  summary: string;
  audioFee: string;
  videoFee: string;
}

export interface UpdateConsultantProfilePayload {
  form: ConsultantProfileFormState;
  imageAsset: Asset | null;
}
