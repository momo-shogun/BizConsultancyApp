import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useConsultantBankDetailsScreen } from '@/features/Profile/hooks/useConsultantBankDetailsScreen';
import {
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '@/features/Profile/constants/profileScreenTheme';
import {
  Button,
  Input,
  SafeAreaWrapper,
  ScreenHeader,
} from '@/shared/components';

import { styles } from './ConsultantBankDetailsScreen.styles';

const CANVAS = '#F4F7FB';
const FOOTER_PADDING = 12;

function SectionLabel({ title }: { title: string }): React.ReactElement {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export function ConsultantBankDetailsScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const screen = useConsultantBankDetailsScreen();
  const footerBottomInset = FOOTER_PADDING + insets.bottom;

  const topChrome = (
    <LinearGradient
      colors={[...PROFILE_HEADER_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.topChrome, { paddingTop: insets.top }]}
    >
      <ScreenHeader
        title="Bank Details"
        onBackPress={screen.goBack}
        headerColor="transparent"
      />
    </LinearGradient>
  );

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={PROFILE_HEADER_STATUS_BAR}
        contentBgColor={CANVAS}
        statusBarStyle="light-content"
        style={styles.screen}
      >
        {topChrome}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={PROFILE_HEADER_STATUS_BAR}
      contentBgColor={CANVAS}
      statusBarStyle="light-content"
      style={styles.screen}
    >
      {topChrome}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: 96 + footerBottomInset },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={screen.isRefreshing}
              onRefresh={screen.refetch}
              tintColor="#059669"
            />
          }
        >
          <LinearGradient
            colors={['#ECFDF5', '#D1FAE5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
            <Text style={styles.bannerText}>
              These details are used for transferring your earnings. You can change them anytime.
            </Text>
          </LinearGradient>

          {screen.loadError != null ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{screen.loadError}</Text>
              <Pressable accessibilityRole="button" onPress={screen.refetch}>
                <Text style={styles.retry}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          <SectionLabel title="Bank account details" />
          <View style={styles.card}>
            <Input
              label="Bank Name"
              value={screen.form.bankName}
              onChangeText={(value) => screen.setField('bankName', value)}
              placeholder="e.g. State Bank of India"
              autoCapitalize="words"
              accessibilityLabel="Bank Name"
            />
            <Input
              label="Branch Name"
              value={screen.form.branchName}
              onChangeText={(value) => screen.setField('branchName', value)}
              placeholder="e.g. Connaught Place"
              autoCapitalize="words"
              accessibilityLabel="Branch Name"
            />
            <Input
              label="Account Name"
              value={screen.form.accountName}
              onChangeText={(value) => screen.setField('accountName', value)}
              placeholder="Name as in bank account"
              autoCapitalize="words"
              accessibilityLabel="Account Name"
            />
            <Input
              label="Account Number"
              value={screen.form.accountNumber}
              onChangeText={(value) => screen.setField('accountNumber', value)}
              placeholder="e.g. 123456789012"
              keyboardType="number-pad"
              maxLength={20}
              accessibilityLabel="Account Number"
            />
            <Input
              label="Confirm Account Number"
              value={screen.form.confirmAccountNumber}
              onChangeText={(value) => screen.setField('confirmAccountNumber', value)}
              placeholder="Re-enter account number"
              keyboardType="number-pad"
              maxLength={20}
              accessibilityLabel="Confirm Account Number"
            />
            {screen.accountMismatch ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.errorText}>Account numbers do not match</Text>
              </View>
            ) : null}
            {screen.validationError != null && !screen.accountMismatch ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{screen.validationError}</Text>
              </View>
            ) : null}
            <Input
              label="IFSC Code"
              value={screen.form.ifscCode}
              onChangeText={(value) => screen.setField('ifscCode', value)}
              placeholder="e.g. SBIN0001234"
              autoCapitalize="characters"
              maxLength={11}
              accessibilityLabel="IFSC Code"
            />
            <Text style={styles.helperText}>
              IFSC code is an 11-character code printed on your cheque book or passbook.
            </Text>
          </View>

          <View style={styles.securityNote}>
            <Ionicons name="lock-closed-outline" size={14} color="#64748B" />
            <Text style={styles.securityText}>
              Your bank details are encrypted and stored securely. We never share them with third
              parties.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerBottomInset }]}>
          <Button
            label="Save changes"
            accessibilityLabel="Save bank details"
            onPress={screen.handleSave}
            disabled={!screen.canSave}
            loading={screen.isSaving}
            style={styles.saveBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
