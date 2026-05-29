import { useCallback, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import {
  selectAccountRole,
  selectDisplayName,
  selectHasVerifiedLogin,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import {
  useGetConsultantWalletBalanceQuery,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

import {
  useCreateAiCreditOrderMutation,
  useGetMyAiUsageQuery,
  useGetPublicAiCreditPackagesQuery,
  usePurchaseAiCreditsWithWalletMutation,
  useVerifyAiCreditPaymentMutation,
} from '../api/aiCreditsApi';
import {
  AiCreditsPaymentCancelledError,
  openAiCreditsRazorpayCheckout,
} from '../services/aiCreditsRazorpayCheckout';
import type { AiCreditPackage } from '../types/aiCredits.types';
import { parseApiErrorMessage } from '../utils/aiCreditsParsing';

export type AiCreditsBuyMode = 'razorpay' | 'wallet';

export interface UseBizAiCreditsScreenResult {
  isConsultant: boolean;
  hasVerifiedLogin: boolean;
  isLoading: boolean;
  packages: AiCreditPackage[];
  remainingCredits: number | null;
  walletInr: number | null;
  errorMessage: string | null;
  successMessage: string | null;
  buyingPackageId: number | null;
  buyMode: AiCreditsBuyMode | null;
  refreshBalances: () => void;
  buyWithWallet: (pkg: AiCreditPackage) => Promise<void>;
  buyWithRazorpay: (pkg: AiCreditPackage) => Promise<void>;
  openWalletTopUp: () => void;
  goBack: () => void;
  canPayWithWallet: (pkg: AiCreditPackage) => boolean;
}

export function useBizAiCreditsScreen(): UseBizAiCreditsScreenResult {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const accountRole = useAppSelector(selectAccountRole);
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const isConsultant = accountRole === 'consultant';
  const customerName = useAppSelector(selectDisplayName) ?? 'User';
  const customerEmail = useAppSelector(selectLoggedInEmail) ?? '';
  const customerPhone = useAppSelector(selectLoggedInMobile) ?? '';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [buyingPackageId, setBuyingPackageId] = useState<number | null>(null);
  const [buyMode, setBuyMode] = useState<AiCreditsBuyMode | null>(null);

  const {
    data: packages = [],
    isLoading: packagesLoading,
    refetch: refetchPackages,
  } = useGetPublicAiCreditPackagesQuery(undefined, { skip: !hasVerifiedLogin });

  const {
    data: usage,
    isLoading: usageLoading,
    refetch: refetchUsage,
  } = useGetMyAiUsageQuery(undefined, { skip: !hasVerifiedLogin });

  const {
    data: userWalletBalance,
    refetch: refetchUserWallet,
  } = useGetMyWalletBalanceQuery(undefined, {
    skip: !hasVerifiedLogin || isConsultant,
  });

  const {
    data: consultantWalletBalance,
    refetch: refetchConsultantWallet,
  } = useGetConsultantWalletBalanceQuery(undefined, {
    skip: !hasVerifiedLogin || !isConsultant,
  });

  const [createOrder] = useCreateAiCreditOrderMutation();
  const [verifyPayment] = useVerifyAiCreditPaymentMutation();
  const [purchaseWithWallet] = usePurchaseAiCreditsWithWalletMutation();

  const walletInr = isConsultant ? consultantWalletBalance : userWalletBalance;
  const remainingCredits = usage?.remainingCredits ?? null;

  const refreshBalances = useCallback((): void => {
    void refetchUsage();
    if (isConsultant) {
      void refetchConsultantWallet();
    } else {
      void refetchUserWallet();
    }
    void refetchPackages();
  }, [isConsultant, refetchConsultantWallet, refetchPackages, refetchUsage, refetchUserWallet]);

  const canPayWithWallet = useCallback(
    (pkg: AiCreditPackage): boolean => {
      if (walletInr == null || !Number.isFinite(walletInr)) {
        return false;
      }
      return walletInr >= pkg.price;
    },
    [walletInr],
  );

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const openWalletTopUp = useCallback((): void => {
    if (isConsultant) {
      navigation.navigate(ROUTES.Account.ConsultantWallet);
      return;
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.Wallet);
    }
  }, [isConsultant, navigation]);

  const buyWithWallet = useCallback(
    async (pkg: AiCreditPackage): Promise<void> => {
      if (!hasVerifiedLogin) {
        setErrorMessage('Please log in to purchase credits.');
        return;
      }
      setBuyingPackageId(pkg.id);
      setBuyMode('wallet');
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        const result = await purchaseWithWallet({ packageId: pkg.id }).unwrap();
        setSuccessMessage(`Credits updated. Balance: ${result.remainingCredits}`);
        refreshBalances();
      } catch (error: unknown) {
        setErrorMessage(parseApiErrorMessage(error, 'Wallet purchase failed'));
      } finally {
        setBuyingPackageId(null);
        setBuyMode(null);
      }
    },
    [hasVerifiedLogin, purchaseWithWallet, refreshBalances],
  );

  const buyWithRazorpay = useCallback(
    async (pkg: AiCreditPackage): Promise<void> => {
      if (!hasVerifiedLogin) {
        setErrorMessage('Please log in to purchase credits.');
        return;
      }
      setBuyingPackageId(pkg.id);
      setBuyMode('razorpay');
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        const order = await createOrder({ packageId: pkg.id }).unwrap();
        const payment = await openAiCreditsRazorpayCheckout({
          order,
          packageCredits: pkg.credits,
          customerName,
          customerEmail,
          customerPhone,
        });
        const result = await verifyPayment({
          packageId: pkg.id,
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        }).unwrap();
        setSuccessMessage(`Credits updated. Balance: ${result.remainingCredits}`);
        refreshBalances();
      } catch (error: unknown) {
        if (error instanceof AiCreditsPaymentCancelledError) {
          return;
        }
        setErrorMessage(parseApiErrorMessage(error, 'Purchase failed'));
      } finally {
        setBuyingPackageId(null);
        setBuyMode(null);
      }
    },
    [
      createOrder,
      customerEmail,
      customerName,
      customerPhone,
      hasVerifiedLogin,
      refreshBalances,
      verifyPayment,
    ],
  );

  const isLoading =
    hasVerifiedLogin &&
    ((packagesLoading && packages.length === 0) || (usageLoading && usage == null));

  return {
    isConsultant,
    hasVerifiedLogin,
    isLoading,
    packages,
    remainingCredits,
    walletInr: walletInr ?? null,
    errorMessage,
    successMessage,
    buyingPackageId,
    buyMode,
    refreshBalances,
    buyWithWallet,
    buyWithRazorpay,
    openWalletTopUp,
    goBack,
    canPayWithWallet,
  };
}
