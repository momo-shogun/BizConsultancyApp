import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  formatWalletBalanceInr,
  useGetConsultantWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import {
  useCreateMyWithdrawalMutation,
  useGetMyWithdrawalsQuery,
} from '@/features/Wallet/api/consultantWithdrawalsApi';
import { ConsultantWalletBalanceHero } from '@/features/Wallet/components/ConsultantWalletBalanceHero';
import { WithdrawalRequestCard } from '@/features/Wallet/components/WithdrawalRequestCard';
import { CONSULTANT_WALLET_CANVAS } from '@/features/Wallet/constants/consultantWalletTheme';
import type { ConsultantWithdrawalItem } from '@/features/Wallet/types/consultantWallet.types';
import {
  formatConsultantWalletAmount,
  readWithdrawalApiError,
} from '@/features/Wallet/utils/consultantWalletUtils';
import { consultantWalletStyles as styles } from '@/features/Wallet/screens/consultantWallet.styles';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { Dialog } from '@/shared/components/dialog';

const dialogFormStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    fontSize: THEME.typography.size[18],
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  formError: {
    fontSize: THEME.typography.size[12],
    color: '#DC2626',
    fontWeight: '600',
    marginTop: THEME.spacing[8],
  },
});

export function ConsultantWithdrawalsScreen(): React.ReactElement {
  const navigation = useNavigation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isFetching: isBalanceFetching,
    refetch: refetchBalance,
  } = useGetConsultantWalletBalanceQuery();
  const {
    data: withdrawals = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyWithdrawalsQuery();
  const [createWithdrawal, { isLoading: isSubmitting }] = useCreateMyWithdrawalMutation();

  const openDialog = useCallback((): void => {
    setAmountInput('');
    setFormError(null);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback((): void => {
    if (!isSubmitting) {
      setDialogOpen(false);
    }
  }, [isSubmitting]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    const amount = Number.parseFloat(amountInput.replace(/,/g, '').trim());
    if (!Number.isFinite(amount) || amount < 1) {
      setFormError('Enter a valid amount (minimum ₹1).');
      return;
    }
    if (balance != null && amount > balance) {
      setFormError(`Amount cannot exceed ${formatConsultantWalletAmount(balance)}.`);
      return;
    }
    setFormError(null);
    try {
      await createWithdrawal({ amount }).unwrap();
      setDialogOpen(false);
      setAmountInput('');
    } catch (error: unknown) {
      setFormError(
        readWithdrawalApiError(error, 'Could not submit withdrawal request. Try again.'),
      );
    }
  }, [amountInput, balance, createWithdrawal, isSubmitting]);

  const renderItem = useCallback(
    ({ item }: { item: ConsultantWithdrawalItem }) => (
      <WithdrawalRequestCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: ConsultantWithdrawalItem): string => String(item.id),
    [],
  );

  const ItemSeparator = useCallback(
    (): React.ReactElement => <View style={styles.itemGap} />,
    [],
  );

  const ListHeader = (
    <>
      <ConsultantWalletBalanceHero
        balance={balance}
        isLoading={isBalanceLoading}
        isFetching={isBalanceFetching}
        onRefresh={() => void refetchBalance()}
        hint="Request a withdrawal to transfer available balance to your bank."
        showPills={false}
      />

      <Pressable
        accessibilityRole="button"
        onPress={openDialog}
        style={({ pressed }) => [styles.primaryCta, pressed ? { opacity: 0.92 } : null]}
      >
        <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.primaryCtaText}>Request withdrawal</Text>
      </Pressable>

      <Text style={styles.listSectionTitle}>Your requests</Text>
    </>
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_WALLET_CANVAS}>
      <ScreenHeader title="Withdrawals" onBackPress={() => navigation.goBack()} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Could not load withdrawals</Text>
          <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={withdrawals}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#059669"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="cash-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No withdrawal requests yet</Text>
              <Text style={styles.emptyText}>
                Tap “Request withdrawal” above to transfer earnings to your bank account.
              </Text>
            </View>
          }
        />
      )}

      <Dialog
        visible={dialogOpen}
        onClose={closeDialog}
        variant="default"
        title="Request withdrawal"
        description={`Available: ${formatWalletBalanceInr(balance ?? 0)}`}
        dismissible={!isSubmitting}
        closeOnBackdrop={!isSubmitting}
        actions={[
          { label: 'Cancel', variant: 'ghost', onPress: closeDialog },
          {
            label: isSubmitting ? 'Submitting…' : 'Submit',
            onPress: () => void handleSubmit(),
          },
        ]}
      >
        <TextInput
          value={amountInput}
          onChangeText={setAmountInput}
          placeholder="Enter amount (₹)"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          style={dialogFormStyles.input}
          editable={!isSubmitting}
        />
        {formError != null ? (
          <Text style={dialogFormStyles.formError}>{formError}</Text>
        ) : null}
        {isSubmitting ? (
          <ActivityIndicator color="#059669" style={{ marginTop: THEME.spacing[8] }} />
        ) : null}
      </Dialog>
    </SafeAreaWrapper>
  );
}
