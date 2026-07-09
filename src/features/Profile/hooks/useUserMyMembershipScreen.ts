import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useRequestMembershipFeatureMutation } from '@/features/Profile/api/membershipRegistrationApi';
import {
  isMembershipFeatureRequestDisabled,
  membershipFeatureRequestLabel,
} from '@/features/Profile/utils/membershipDashboardParsing';
import type { AccountStackParamList } from '@/navigation/types';
import { showGlobalError, showGlobalToast } from '@/shared/components/toast';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

import {
  useUserProfileMembershipSection,
  type ProfileMembershipLine,
} from './useUserProfileMembershipSection';

export interface MembershipServiceItem {
  id: string;
  featureId: number | null;
  title: string;
  statusLabel: string;
  userStatus: string | null;
  requestLabel: string;
  canRequest: boolean;
}

export interface MyMembershipCardModel {
  planName: string;
  planSubtitle: string;
  status: string;
  amount: string;
  validity: string;
  startDate: string;
  expiryDate: string;
  progressPercent: number;
  paymentAmount: string;
  paymentStatus: string;
  services: MembershipServiceItem[];
}

function parseFeatureId(id: string): number | null {
  const featureId = Number.parseInt(id, 10);
  return Number.isFinite(featureId) ? featureId : null;
}

/** @deprecated Use `MyMembershipCardModel`. */
export type UserMyMembershipCardModel = MyMembershipCardModel;

export interface UseMyMembershipScreenOptions {
  membershipLine: ProfileMembershipLine;
}

export interface UseMyMembershipScreenResult {
  hasVerifiedLogin: boolean;
  isLoading: boolean;
  cardProps: MyMembershipCardModel | null;
  requestingFeatureId: number | null;
  onBackPress: () => void;
  onRequestService: (featureId: number) => Promise<void>;
}

/** @deprecated Use `UseMyMembershipScreenResult`. */
export type UseUserMyMembershipScreenResult = UseMyMembershipScreenResult;

export function useMyMembershipScreen(
  options: UseMyMembershipScreenOptions,
): UseMyMembershipScreenResult {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const [requestingFeatureId, setRequestingFeatureId] = useState<number | null>(null);

  const membership = useUserProfileMembershipSection({
    enabled: hasVerifiedLogin,
    membershipLine: options.membershipLine,
    maxBenefits: 100,
  });

  const [requestFeature] = useRequestMembershipFeatureMutation();

  const onBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const cardProps = useMemo((): MyMembershipCardModel | null => {
    if (!membership.hasPlan) {
      return null;
    }

    const validityParts = membership.validityText?.split('–').map((part) => part.trim()) ?? [];
    const startDate = validityParts[0] ?? '—';
    const expiryDate = validityParts[1] ?? validityParts[0] ?? '—';
    const amountLabel = membership.priceLabel ?? '—';
    const validityLabel = membership.durationLabel ?? membership.validityText ?? '—';

    const services: MembershipServiceItem[] = membership.benefits.map((benefit) => {
      const featureId = parseFeatureId(benefit.id);
      const userStatus = benefit.userStatus;
      const canRequest =
        featureId != null && !isMembershipFeatureRequestDisabled(userStatus);

      return {
        id: benefit.id,
        featureId,
        title: benefit.title,
        statusLabel: benefit.statusLabel ?? 'Pending',
        userStatus,
        requestLabel: membershipFeatureRequestLabel(userStatus),
        canRequest,
      };
    });

    return {
      planName: membership.planName,
      planSubtitle: membership.durationLabel ?? 'Premium Business Membership',
      status: membership.statusLabel,
      amount: amountLabel,
      validity: validityLabel,
      startDate,
      expiryDate,
      progressPercent: membership.progressPercent,
      paymentAmount: amountLabel,
      paymentStatus: membership.isActive ? 'Completed' : membership.statusLabel,
      services,
    };
  }, [membership]);

  const onRequestService = useCallback(
    async (featureId: number): Promise<void> => {
      setRequestingFeatureId(featureId);
      try {
        const result = await requestFeature(featureId).unwrap();
        const message =
          result.title.length > 0
            ? `Request sent for ${result.title}`
            : 'Service request sent';
        showGlobalToast({ message, variant: 'success' });
        membership.refetch();
      } catch (error) {
        showGlobalError(getApiErrorMessage(error, 'Failed to request service'));
      } finally {
        setRequestingFeatureId(null);
      }
    },
    [membership, requestFeature],
  );

  return {
    hasVerifiedLogin,
    isLoading: membership.isLoading,
    cardProps,
    requestingFeatureId,
    onBackPress,
    onRequestService,
  };
}

export function useUserMyMembershipScreen(): UseMyMembershipScreenResult {
  return useMyMembershipScreen({ membershipLine: 'users' });
}

export function useConsultantMyMembershipScreen(): UseMyMembershipScreenResult {
  return useMyMembershipScreen({ membershipLine: 'experts' });
}
