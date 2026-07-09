import { useCallback, useMemo } from 'react';

import {
  selectAccountRole,
  selectIsAuthenticated,
  selectIsGuestSession,
} from '@/features/Auth/store/authSelectors';
import { useGetMyEdpPurchaseQuery } from '@/features/Edp/api/edpPurchasesApi';
import { promptEdpEnrollment } from '@/features/Edp/utils/edpEnrollPrompt';
import { useAppSelector } from '@/store/typedHooks';

export interface UseEdpAccessResult {
  isLoggedInUser: boolean;
  isGuestBrowse: boolean;
  canAccessFullEdp: boolean;
  hasActiveEnrollment: boolean;
  isConsultant: boolean;
  isEnrollmentLoading: boolean;
  promptEnroll: () => void;
  runWithFullEdpAccess: (action: () => void) => void;
}

export function useEdpAccess(): UseEdpAccessResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isGuestSession = useAppSelector(selectIsGuestSession);
  const accountRole = useAppSelector(selectAccountRole);
  const isLoggedInUser = isAuthenticated && !isGuestSession;
  const isGuestBrowse = !isLoggedInUser;

  const {
    data: enrollment,
    isLoading: isEnrollmentLoading,
    isFetching: isEnrollmentFetching,
  } = useGetMyEdpPurchaseQuery(undefined, {
    skip: !isLoggedInUser,
  });

  const hasActiveEnrollment = enrollment?.hasActiveEnrollment === true;
  const isConsultant = enrollment?.isConsultant === true || accountRole === 'consultant';
  const canAccessFullEdp = hasActiveEnrollment;

  const promptEnroll = useCallback((): void => {
    promptEdpEnrollment({ isConsultant });
  }, [isConsultant]);

  const runWithFullEdpAccess = useCallback(
    (action: () => void): void => {
      if (canAccessFullEdp) {
        action();
        return;
      }
      if (isLoggedInUser) {
        promptEnroll();
      }
    },
    [canAccessFullEdp, isLoggedInUser, promptEnroll],
  );

  return useMemo(
    () => ({
      isLoggedInUser,
      isGuestBrowse,
      canAccessFullEdp,
      hasActiveEnrollment,
      isConsultant,
      isEnrollmentLoading: isLoggedInUser && (isEnrollmentLoading || isEnrollmentFetching),
      promptEnroll,
      runWithFullEdpAccess,
    }),
    [
      canAccessFullEdp,
      hasActiveEnrollment,
      isConsultant,
      isEnrollmentFetching,
      isEnrollmentLoading,
      isGuestBrowse,
      isLoggedInUser,
      promptEnroll,
      runWithFullEdpAccess,
    ],
  );
}
