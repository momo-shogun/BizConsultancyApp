import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { setAuthProfile } from '@/features/Auth/store/authSlice';
import {
  selectDisplayName,
  selectHasVerifiedLogin,
} from '@/features/Auth/store/authSelectors';
import { useGetConsultantMyProfileQuery } from '@/features/Profile/api/consultantProfileApi';
import { useGetUserMeQuery } from '@/features/Profile/api/userProfileApi';
import type { ConsultantMyProfileDto } from '@/features/Profile/types/consultantProfile.types';
import type { UserMeDto } from '@/features/Profile/types/userProfile.types';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';

function hasText(value: string | null | undefined): boolean {
  return value != null && value.trim().length > 0;
}

export function isUserProfileDisplayMissing(
  profile: UserMeDto | undefined,
  displayName: string | null,
): boolean {
  if (profile == null) {
    return true;
  }
  const hasName = hasText(profile.name) || hasText(displayName);
  const hasThumbnail = hasText(profile.thumbnail);
  return !hasName || !hasThumbnail;
}

export function isConsultantProfileDisplayMissing(
  profile: ConsultantMyProfileDto | undefined,
  displayName: string | null,
): boolean {
  if (profile == null) {
    return true;
  }
  const hasName = hasText(profile.name) || hasText(displayName);
  const hasThumbnail = hasText(profile.thumbnail);
  return !hasName || !hasThumbnail;
}

function syncAuthProfileFromMe(
  dispatch: ReturnType<typeof useAppDispatch>,
  profile: UserMeDto | ConsultantMyProfileDto,
): void {
  dispatch(
    setAuthProfile({
      ...(hasText(profile.name) ? { displayName: profile.name?.trim() ?? null } : {}),
      ...(hasText(profile.email) ? { email: profile.email?.trim() ?? null } : {}),
      ...(hasText(profile.mobile) ? { mobile: profile.mobile?.trim() ?? null } : {}),
    }),
  );
}

export interface UseUserAccountProfileResult {
  profile: UserMeDto | undefined;
}

export function useUserAccountProfile(): UseUserAccountProfileResult {
  const dispatch = useAppDispatch();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const displayName = useAppSelector(selectDisplayName);

  const {
    data: profile,
    refetch,
    isUninitialized,
  } = useGetUserMeQuery(undefined, {
    skip: !hasVerifiedLogin,
  });

  useEffect(() => {
    if (profile != null) {
      syncAuthProfileFromMe(dispatch, profile);
    }
  }, [dispatch, profile]);

  const shouldHydrateProfile = useCallback((): boolean => {
    if (!hasVerifiedLogin) {
      return false;
    }
    return isUninitialized || isUserProfileDisplayMissing(profile, displayName);
  }, [displayName, hasVerifiedLogin, isUninitialized, profile]);

  useFocusEffect(
    useCallback(() => {
      if (!shouldHydrateProfile()) {
        return;
      }
      void refetch();
    }, [refetch, shouldHydrateProfile]),
  );

  return { profile };
}

export interface UseConsultantAccountProfileResult {
  profile: ConsultantMyProfileDto | undefined;
}

export function useConsultantAccountProfile(): UseConsultantAccountProfileResult {
  const dispatch = useAppDispatch();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const displayName = useAppSelector(selectDisplayName);

  const {
    data: profile,
    refetch,
    isUninitialized,
  } = useGetConsultantMyProfileQuery(undefined, {
    skip: !hasVerifiedLogin,
  });

  useEffect(() => {
    if (profile != null) {
      syncAuthProfileFromMe(dispatch, profile);
    }
  }, [dispatch, profile]);

  const shouldHydrateProfile = useCallback((): boolean => {
    if (!hasVerifiedLogin) {
      return false;
    }
    return isUninitialized || isConsultantProfileDisplayMissing(profile, displayName);
  }, [displayName, hasVerifiedLogin, isUninitialized, profile]);

  useFocusEffect(
    useCallback(() => {
      if (!shouldHydrateProfile()) {
        return;
      }
      void refetch();
    }, [refetch, shouldHydrateProfile]),
  );

  return { profile };
}
