import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { selectAccountRole, selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { DiagnosisPaymentModal } from '@/features/Diagnostics/components/DiagnosisPaymentModal';
import { useGetMyEdpPurchaseQuery } from '@/features/Edp/api/edpPurchasesApi';
import { useEdpEnrollmentPurchase } from '@/features/Edp/hooks/useEdpEnrollmentPurchase';
import { formatEdpDate } from '@/features/Edp/utils/edpPurchaseParsing';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';
import { THEME } from '@/constants/theme';
import { useAppSelector } from '@/store/typedHooks';

import { MY_EDP_CANVAS, styles } from './MyEdpScreen.styles';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.MyEdp>;

export function MyEdpScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);
  const purchaseFlow = useEdpEnrollmentPurchase();

  const {
    data: enrollment,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyEdpPurchaseQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isConsultant = enrollment?.isConsultant === true || accountRole === 'consultant';
  const hasActiveEnrollment = enrollment?.hasActiveEnrollment === true;

  const navigateToEdpProgramme = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.App, {
      screen: ROUTES.App.Edp,
      params: { screen: ROUTES.Edp.Main },
    });
  }, []);

  const navigateToModules = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.App, {
      screen: ROUTES.App.Edp,
      params: { screen: ROUTES.Edp.Modules },
    });
  }, []);

  const handleEnrollPress = useCallback((): void => {
    if (isConsultant) {
      return;
    }
    if (hasActiveEnrollment) {
      navigateToModules();
      return;
    }
    purchaseFlow.openPaymentModal();
  }, [hasActiveEnrollment, isConsultant, navigateToModules, purchaseFlow]);

  if (!isAuthenticated) {
    return (
      <AccountHubScreenShell
        title="My EDP"
        onBackPress={() => navigation.goBack()}
        canvasColor={MY_EDP_CANVAS}
        edges={['top']}
      >
        <View style={styles.centered}>
          <Text style={styles.cardDesc}>Sign in to view your EDP enrollment.</Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigationRef.navigate(ROUTES.Root.Auth, { screen: ROUTES.Auth.Login })
            }
          >
            <Text style={styles.primaryBtnText}>Log in</Text>
          </Pressable>
        </View>
      </AccountHubScreenShell>
    );
  }

  if (isLoading && enrollment == null) {
    return (
      <AccountHubScreenShell
        title="My EDP"
        onBackPress={() => navigation.goBack()}
        canvasColor={MY_EDP_CANVAS}
        edges={['top']}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </AccountHubScreenShell>
    );
  }

  return (
    <AccountHubScreenShell
      title="My EDP"
      onBackPress={() => navigation.goBack()}
      canvasColor={MY_EDP_CANVAS}
      edges={['top']}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => void refetch()}
            tintColor={THEME.colors.primary}
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Entrepreneurship Development Programme</Text>
          <Text style={styles.heroSubtitle}>
            Check enrollment and continue your structured business training.
          </Text>
        </View>

        {isError ? (
          <View style={styles.card}>
            <Text style={styles.errorText}>Could not load EDP status. Pull down to retry.</Text>
            <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
            <Pressable style={styles.outlineBtn} onPress={navigateToEdpProgramme}>
              <Text style={styles.outlineBtnText}>Open EDP programme</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="briefcase-outline" size={22} color={THEME.colors.primary} />
              </View>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.cardTitle}>EDP access</Text>
                <Text style={styles.cardDesc}>
                  {isConsultant
                    ? 'EDP is available for user accounts only.'
                    : hasActiveEnrollment
                      ? 'Your enrollment is active.'
                      : 'You are not enrolled yet.'}
                </Text>
              </View>
            </View>

            {hasActiveEnrollment && !isConsultant ? (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            ) : null}

            {hasActiveEnrollment && enrollment?.purchase != null ? (
              <>
                <Text style={styles.detailLine}>
                  Enrolled on {formatEdpDate(enrollment.purchase.joiningDate)}
                  {enrollment.purchase.expiryDate != null
                    ? ` · Valid until ${formatEdpDate(enrollment.purchase.expiryDate)}`
                    : ''}
                </Text>
                {enrollment.purchase.amount > 0 ? (
                  <Text style={styles.amountLine}>
                    Paid ₹{enrollment.purchase.amount.toLocaleString('en-IN')}
                  </Text>
                ) : null}
              </>
            ) : null}

            {isConsultant ? (
              <View style={styles.infoCard}>
                <Ionicons name="information-circle-outline" size={20} color="#D97706" />
                <Text style={styles.infoText}>
                  Switch to a user account to purchase and access EDP modules, videos, and PDFs.
                </Text>
              </View>
            ) : null}

            {!isConsultant ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleEnrollPress}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed ? { opacity: 0.9 } : null,
                ]}
              >
                <Ionicons
                  name={hasActiveEnrollment ? 'play-circle-outline' : 'card-outline'}
                  size={18}
                  color={THEME.colors.white}
                />
                <Text style={styles.primaryBtnText}>
                  {hasActiveEnrollment ? 'Start training' : 'Enroll now'}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={navigateToEdpProgramme}
              style={({ pressed }) => [styles.outlineBtn, pressed ? { opacity: 0.9 } : null]}
            >
              <Text style={styles.outlineBtnText}>Explore EDP programme</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <DiagnosisPaymentModal
        visible={purchaseFlow.paymentModalVisible}
        packTitle="EDP programme enrollment"
        amountRupees={purchaseFlow.programAmountRupees}
        walletBalanceRupees={purchaseFlow.walletBalanceRupees}
        canPayWithWallet={purchaseFlow.canPayWithWallet}
        payingWith={purchaseFlow.payingWith}
        isBusy={purchaseFlow.isBusy}
        onClose={purchaseFlow.closePaymentModal}
        onPayRazorpay={() => void purchaseFlow.payWithRazorpay()}
        onPayWallet={() => void purchaseFlow.payWithWallet()}
      />
    </AccountHubScreenShell>
  );
}
