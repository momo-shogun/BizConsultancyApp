import { z } from 'zod';

import type {
  ConsultantGenderValue,
  ConsultantProfileFormState,
} from '../types/consultantProfile.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const genderSchema = z.union([
  z.literal('male'),
  z.literal('female'),
  z.literal('other'),
  z.literal('prefer_not'),
  z.literal(''),
]);

export const consultantProfileFormSchema = z.object({
  email: z
    .string()
    .trim()
    .max(255, 'Email must be at most 255 characters')
    .refine(
      (value) => value.length === 0 || EMAIL_PATTERN.test(value),
      'Enter a valid email address',
    ),
  gender: genderSchema,
  pincode: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length === 0 || digits.length === 6;
    }, 'Enter a valid 6-digit pincode'),
  city: z.string().trim().max(100, 'City must be at most 100 characters'),
  state: z.string().trim().max(100, 'State must be at most 100 characters'),
  address: z.string().trim().max(500, 'Address is too long'),
  experience: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^\d{1,2}$/.test(value), 'Enter years as a number'),
  dob: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Enter a valid date of birth',
    ),
  qualification: z.string().trim().max(120, 'Qualification is too long'),
  summary: z.string().trim().max(2000, 'Summary is too long'),
  audioFee: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^\d+(\.\d+)?$/.test(value), 'Enter a valid fee'),
  videoFee: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^\d+(\.\d+)?$/.test(value), 'Enter a valid fee'),
});

export type ConsultantProfileFieldKey = keyof ConsultantProfileFormState;

export type ConsultantProfileFieldErrors = Partial<
  Record<ConsultantProfileFieldKey, string>
>;

export interface ConsultantProfileValidationResult {
  success: boolean;
  errors: ConsultantProfileFieldErrors;
  data?: ConsultantProfileFormState;
}

export function validateConsultantProfileForm(
  form: ConsultantProfileFormState,
): ConsultantProfileValidationResult {
  const parsed = consultantProfileFormSchema.safeParse(form);
  if (!parsed.success) {
    const errors: ConsultantProfileFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && errors[key as ConsultantProfileFieldKey] == null) {
        errors[key as ConsultantProfileFieldKey] = issue.message;
      }
    }
    return { success: false, errors };
  }
  return { success: true, errors: {}, data: parsed.data as ConsultantProfileFormState };
}

export function normalizeConsultantProfileForm(
  form: ConsultantProfileFormState,
): ConsultantProfileFormState {
  return {
    ...form,
    email: form.email.trim(),
    pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
    city: form.city.trim(),
    state: form.state.trim(),
    address: form.address.trim(),
    experience: form.experience.replace(/\D/g, '').slice(0, 2),
    qualification: form.qualification.trim(),
    summary: form.summary.trim(),
    audioFee: form.audioFee.trim(),
    videoFee: form.videoFee.trim(),
    gender: form.gender as ConsultantGenderValue,
  };
}
