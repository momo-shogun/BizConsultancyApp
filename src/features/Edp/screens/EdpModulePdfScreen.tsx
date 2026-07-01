import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import { DiagnosisPaymentModal } from '@/features/Diagnostics/components/DiagnosisPaymentModal';
import { EdpEnrollmentRequiredView } from '@/features/Edp/components/EdpEnrollmentRequiredView';
import { useEdpAccess } from '@/features/Edp/hooks/useEdpAccess';
import { useEdpEnrollmentPurchase } from '@/features/Edp/hooks/useEdpEnrollmentPurchase';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import { buildEdpPdfWebViewUri } from '../utils/edpMedia';

export default function EdpModulePdfScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const route = useRoute<RouteProp<EdpStackParamList, typeof ROUTES.Edp.ModulePdf>>();
  const { title, pdfUrl } = route.params;
  const {
    canAccessFullEdp,
    isLoggedInUser,
    isConsultant,
    isEnrollmentLoading,
  } = useEdpAccess();
  const purchaseFlow = useEdpEnrollmentPurchase();

  const [webLoading, setWebLoading] = useState(true);
  const [webError, setWebError] = useState(false);

  const webUri = useMemo(() => buildEdpPdfWebViewUri(pdfUrl), [pdfUrl]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const openInBrowser = useCallback((): void => {
    void Linking.openURL(pdfUrl);
  }, [pdfUrl]);

  if (isLoggedInUser && !isEnrollmentLoading && !canAccessFullEdp) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenHeader title={title} onBackPress={handleBack} />
        <EdpEnrollmentRequiredView
          isConsultant={isConsultant}
          onEnrollPress={isConsultant ? undefined : () => purchaseFlow.openPaymentModal()}
        />
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
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title={title} onBackPress={handleBack} />
      <ScreenWrapper style={styles.flex}>
        <View style={styles.previewHost}>
          {webLoading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={THEME.colors.primary} />
              <Text style={styles.loadingText}>Loading PDF…</Text>
            </View>
          ) : null}

          {webError ? (
            <View style={styles.errorState}>
              <Text style={styles.errorText}>This PDF could not be loaded in the app.</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open PDF in browser"
                onPress={openInBrowser}
                style={({ pressed }) => [styles.openBrowserButton, pressed ? styles.pressed : null]}
              >
                <Ionicons name="open-outline" size={18} color={THEME.colors.white} />
                <Text style={styles.openBrowserLabel}>Open in browser</Text>
              </Pressable>
            </View>
          ) : (
            <WebView
              source={{ uri: webUri }}
              style={styles.webView}
              onLoadStart={() => {
                setWebLoading(true);
                setWebError(false);
              }}
              onLoadEnd={() => setWebLoading(false)}
              onError={() => {
                setWebLoading(false);
                setWebError(true);
              }}
              onHttpError={() => {
                setWebLoading(false);
                setWebError(true);
              }}
              startInLoadingState={false}
              scalesPageToFit
              javaScriptEnabled
              domStorageEnabled
            />
          )}
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  previewHost: {
    flex: 1,
    marginTop: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
    backgroundColor: THEME.colors.white,
  },
  webView: {
    flex: 1,
    backgroundColor: THEME.colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.white,
    zIndex: 1,
    gap: THEME.spacing[8],
  },
  loadingText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    gap: THEME.spacing[16],
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  openBrowserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[8],
    backgroundColor: THEME.colors.primary,
  },
  openBrowserLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  pressed: {
    opacity: 0.88,
  },
});
