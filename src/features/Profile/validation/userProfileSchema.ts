import { z } from 'zod';

import type { UserGenderValue, UserProfileFormState } from '../types/userProfile.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const genderSchema = z.union([
  z.literal('male'),
  z.literal('female'),
  z.literal('other'),
  z.literal(''),
]);

export const userProfileFormSchema = z.object({
  email: z
    .string()
    .trim()
    .max(255, 'Email must be at most 255 characters')
    .refine(
      (value) => value.length === 0 || EMAIL_PATTERN.test(value),
      'Enter a valid email address',
    ),
  city: z
    .string()
    .trim()
    .max(100, 'City must be at most 100 characters')
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      'City must be at least 2 characters',
    ),
  state: z
    .string()
    .trim()
    .max(100, 'State must be at most 100 characters')
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      'State must be at least 2 characters',
    ),
  pincode: z
    .string()
    .trim()
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.length === 0 || digits.length === 6;
      },
      'Enter a valid 6-digit pincode',
    ),
  gender: genderSchema,
});

export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>;

export type UserProfileFieldKey = keyof UserProfileFormState;

export type UserProfileFieldErrors = Partial<Record<UserProfileFieldKey, string>>;

export interface UserProfileValidationResult {
  success: boolean;
  errors: UserProfileFieldErrors;
  data?: UserProfileFormValues;
}

export function normalizeUserProfileForm(
  form: UserProfileFormState,
): UserProfileFormState {
  return {
    ...form,
    email: form.email.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
    gender: form.gender,
  };
}

export function validateUserProfileForm(
  form: UserProfileFormState,
): UserProfileValidationResult {
  const normalized = normalizeUserProfileForm(form);
  const result = userProfileFormSchema.safeParse(normalized);

  if (result.success) {
    return { success: true, errors: {}, data: result.data };
  }

  const errors: UserProfileFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && errors[field as UserProfileFieldKey] == null) {
      errors[field as UserProfileFieldKey] = issue.message;
    }
  }

  return { success: false, errors };
}
