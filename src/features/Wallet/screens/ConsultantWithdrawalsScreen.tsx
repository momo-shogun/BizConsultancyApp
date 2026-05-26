import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
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

const modalStyles = {
  overlay: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  backdrop: {
    ...Platform.select({
      default: {},
    }),
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.5)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[28],
    gap: THEME.spacing[12],
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center' as const,
    marginBottom: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800' as const,
    color: '#0F172A',
  },
  hint: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    fontWeight: '500' as const,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    fontSize: THEME.typography.size[18],
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  formError: {
    fontSize: THEME.typography.size[12],
    color: '#DC2626',
    fontWeight: '600' as const,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: THEME.spacing[10],
    marginTop: THEME.spacing[4],
  },
  secondary: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700' as const,
    color: '#334155',
  },
  primary: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  primaryText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
};

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
  }, [amountInput, balance, createWithdrawal]);

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

      <Modal visible={dialogOpen} transparent animationType="slide" onRequestClose={closeDialog}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={modalStyles.overlay}
        >
          <Pressable style={modalStyles.backdrop} onPress={closeDialog} />
          <View style={modalStyles.sheet}>
            <View style={modalStyles.handle} />
            <Text style={modalStyles.title}>Request withdrawal</Text>
            <Text style={modalStyles.hint}>
              Available: {formatWalletBalanceInr(balance ?? 0)}
            </Text>
            <TextInput
              value={amountInput}
              onChangeText={setAmountInput}
              placeholder="Enter amount (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              style={modalStyles.input}
              editable={!isSubmitting}
            />
            {formError != null ? <Text style={modalStyles.formError}>{formError}</Text> : null}
            <View style={modalStyles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={closeDialog}
                disabled={isSubmitting}
                style={modalStyles.secondary}
              >
                <Text style={modalStyles.secondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => void handleSubmit()}
                disabled={isSubmitting}
                style={[modalStyles.primary, isSubmitting ? { opacity: 0.7 } : null]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={modalStyles.primaryText}>Submit</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaWrapper>
  );
}
