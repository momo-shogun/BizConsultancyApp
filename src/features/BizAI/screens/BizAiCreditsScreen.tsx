import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { BizAiCreditsAlertBanner } from '@/features/BizAI/components/BizAiCreditsAlertBanner';
import { BizAiCreditsHero } from '@/features/BizAI/components/BizAiCreditsHero';
import { BizAiCreditsPackageCard } from '@/features/BizAI/components/BizAiCreditsPackageCard';
import { BizAiCreditsWalletCard } from '@/features/BizAI/components/BizAiCreditsWalletCard';
import { WalletAiCreditsConfirmDialog } from '@/features/BizAI/components/WalletAiCreditsConfirmDialog/WalletAiCreditsConfirmDialog';
import { AccountHubScreenShell, EmptyState } from '@/shared/components';

import { useBizAiCreditsScreen } from '../hooks/useBizAiCreditsScreen';
import type { AiCreditPackage } from '../types/aiCredits.types';
import { bizAiCreditsScreenStyles as s } from './BizAiCreditsScreen.styles';

function pickPopularPackageIndex(packages: readonly AiCreditPackage[]): number {
  if (packages.length < 2) {
    return -1;
  }
  let bestIndex = 0;
  let bestRatio = 0;
  for (let i = 0; i < packages.length; i += 1) {
    const pkg = packages[i];
    if (pkg.price <= 0) {
      continue;
    }
    const ratio = pkg.credits / pkg.price;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function BizAiCreditsScreen(): React.ReactElement {
  const {
    isConsultant,
    hasVerifiedLogin,
    isLoading,
    packages,
    remainingCredits,
    walletInr,
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
  } = useBizAiCreditsScreen();

  const [walletConfirmPackage, setWalletConfirmPackage] =
    useState<AiCreditPackage | null>(null);

  const isWalletDialogBusy = buyMode === 'wallet' && buyingPackageId != null;
  const popularIndex = pickPopularPackageIndex(packages);

  const closeWalletDialog = useCallback((): void => {
    if (isWalletDialogBusy) {
      return;
    }
    setWalletConfirmPackage(null);
  }, [isWalletDialogBusy]);

  const confirmWalletPurchase = useCallback((): void => {
    if (walletConfirmPackage == null || isWalletDialogBusy) {
      return;
    }
    void buyWithWallet(walletConfirmPackage).finally(() => {
      setWalletConfirmPackage(null);
    });
  }, [buyWithWallet, isWalletDialogBusy, walletConfirmPackage]);

  if (!hasVerifiedLogin) {
    return (
      <AccountHubScreenShell
        title="Biz AI Credits"
        onBackPress={goBack}
        canvasColor="#F1F5F9"
      >
        <View style={{ flex: 1, padding: 20 }}>
          <EmptyState
            title="Sign in required"
            description="Log in to your account to buy Biz AI credits."
          />
        </View>
      </AccountHubScreenShell>
    );
  }

  return (
    <AccountHubScreenShell
      title="Biz AI Credits"
      onBackPress={goBack}
      canvasColor="#F1F5F9"
    >
      <ScrollView
        style={s.screen}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BizAiCreditsHero remainingCredits={remainingCredits} onRefresh={refreshBalances} />

        <BizAiCreditsWalletCard
          isConsultant={isConsultant}
          walletInr={walletInr}
          onTopUp={openWalletTopUp}
        />

        {errorMessage != null ? (
          <BizAiCreditsAlertBanner variant="error" message={errorMessage} />
        ) : null}

        {successMessage != null ? (
          <BizAiCreditsAlertBanner variant="success" message={successMessage} />
        ) : null}

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Credit packs</Text>
            {packages.length > 0 ? (
              <View style={s.packCount}>
                <Text style={s.packCountText}>{packages.length}</Text>
              </View>
            ) : null}
          </View>
          <Text style={s.sectionSubtitle}>
            Choose a pack and pay instantly with your wallet or Razorpay.
          </Text>
        </View>

        {isLoading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={s.loadingText}>Loading credit packs…</Text>
          </View>
        ) : null}

        {!isLoading && packages.length === 0 ? (
          <View style={s.emptyWrap}>
            <Ionicons name="sparkles-outline" size={32} color="#94A3B8" />
            <Text style={s.emptyTitle}>No packs available</Text>
            <Text style={s.emptyBody}>
              Credit packages are not available right now. Pull to refresh or try again later.
            </Text>
          </View>
        ) : null}

        {!isLoading && packages.length > 0 ? (
          <View style={s.packList}>
            {packages.map((pkg, index) => {
              const busy = buyingPackageId === pkg.id;
              return (
                <BizAiCreditsPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isPopular={index === popularIndex}
                  walletOk={canPayWithWallet(pkg)}
                  busy={busy}
                  buyMode={buyMode}
                  onWalletPress={() => {
                    setWalletConfirmPackage(pkg);
                  }}
                  onRazorpayPress={() => {
                    void buyWithRazorpay(pkg);
                  }}
                />
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      <WalletAiCreditsConfirmDialog
        visible={walletConfirmPackage != null}
        creditPackage={walletConfirmPackage}
        walletInr={walletInr}
        isConsultant={isConsultant}
        isBusy={isWalletDialogBusy}
        onClose={closeWalletDialog}
        onConfirm={confirmWalletPurchase}
      />
    </AccountHubScreenShell>
  );
}
