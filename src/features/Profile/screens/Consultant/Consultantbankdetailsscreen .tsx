import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import {
  Button,
  Input,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

import { styles } from './ConsultantBankDetailsScreen.styles';
import { AccountStackParamList } from '@/navigation/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// ── Types ─────────────────────────────────────────────────────────────────────
interface BankFormState {
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ConsultantBankDetailsScreen(): React.ReactElement {
  const [form, setForm] = useState<BankFormState>({
    bankName: '',
    branchName: '',
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
  });

  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  function set(key: keyof BankFormState) {
    return (val: string) => setForm((prev) => ({ ...prev, [key]: val }));
  }

  const accountMismatch =
    form.confirmAccountNumber.length > 0 &&
    form.accountNumber !== form.confirmAccountNumber;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <ScreenHeader
        title="Bank Details"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenWrapper style={{ padding: 0 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Info banner ── */}
          <LinearGradient
            colors={['#F0FAF5', '#E8F5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={THEME.colors.primary}
            />
            <Text style={styles.bannerText}>
              These details are used for transferring your earnings. You can change them anytime.
            </Text>
          </LinearGradient>

          {/* ── Bank Details ── */}
          <SectionLabel title="Bank Account Details" />
          <View style={styles.card}>
            <Input
              label="Bank Name"
              value={form.bankName}
              onChangeText={set('bankName')}
              placeholder="e.g. State Bank of India"
              autoCapitalize="words"
              accessibilityLabel="Bank Name"
            />
            <Input
              label="Branch Name"
              value={form.branchName}
              onChangeText={set('branchName')}
              placeholder="e.g. Connaught Place"
              autoCapitalize="words"
              accessibilityLabel="Branch Name"
            />
            <Input
              label="Account Name"
              value={form.accountName}
              onChangeText={set('accountName')}
              placeholder="Name as in bank account"
              autoCapitalize="words"
              accessibilityLabel="Account Name"
            />
            <Input
              label="Account Number"
              value={form.accountNumber}
              onChangeText={set('accountNumber')}
              placeholder="e.g. 123456789012"
              keyboardType="number-pad"
              secureTextEntry={false}
              accessibilityLabel="Account Number"
            />
            <Input
              label="Confirm Account Number"
              value={form.confirmAccountNumber}
              onChangeText={set('confirmAccountNumber')}
              placeholder="Re-enter account number"
              keyboardType="number-pad"
              accessibilityLabel="Confirm Account Number"
            />
            {accountMismatch && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.errorText}>Account numbers do not match</Text>
              </View>
            )}
            <Input
              label="IFSC Code"
              value={form.ifscCode}
              onChangeText={(val) => set('ifscCode')(val.toUpperCase())}
              placeholder="e.g. SBIN0001234"
              autoCapitalize="characters"
              accessibilityLabel="IFSC Code"
            />
            <Text style={styles.helperText}>
              IFSC code is an 11-character code printed on your cheque book or passbook.
            </Text>
          </View>

          {/* ── Security note ── */}
          <View style={styles.securityNote}>
            <Ionicons name="lock-closed-outline" size={14} color={THEME.colors.textSecondary} />
            <Text style={styles.securityText}>
              Your bank details are encrypted and stored securely. We never share them with third parties.
            </Text>
          </View>
        </ScrollView>
      </ScreenWrapper>

      <View style={styles.stickyFooter}>
        <Button
          label="Save Changes"
          onPress={() => {}}
          accessibilityLabel="Save Changes"
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaWrapper>
  );
}