import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { navigationRef } from '@/navigation/RootNavigator';

const WalletScreen = () => {
  const [amount, setAmount] = useState('1000');

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={'transparent'}>
      <ScreenHeader title="Biz Wallet" onBackPress={() => navigationRef.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Zepto Cash</Text>
        </View> */}



        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>

          <Text style={styles.balanceAmount}>₹0</Text>
        </View>

        {/* Add Money Card */}
        <View style={styles.addMoneyCard}>
          <Text style={styles.inputLabel}>
            Add amount <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.currency}>₹</Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Balance</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <TouchableOpacity activeOpacity={0.8} style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#8A94A6"
              />

              <Text style={styles.optionText}>How it works</Text>
            </View>


            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity activeOpacity={0.8} style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color="#8A94A6"
              />

              <Text style={styles.optionText}>Transactions</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity activeOpacity={0.8} style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#8A94A6"
              />

              <Text style={styles.optionText}>FAQs</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 14,
  },

  balanceLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    color: '#98A2B3',
    marginBottom: 8,
    fontWeight: '600',
  },

  balanceAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: '#111827',
  },

  addMoneyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    color: '#5B6472',
    marginBottom: 8,
    fontWeight: '500',
  },

  required: {
    color: '#FF4D4F',
  },

  inputContainer: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  currency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
    padding: 0,
    fontWeight: '600',
  },

  addButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FF0A63',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  giftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  giftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  giftIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  giftText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  addCardButton: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF0A63',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addCardButtonText: {
    color: '#FF0A63',
    fontSize: 14,
    fontWeight: '700',
  },

  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  optionRow: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEFF3',
    marginHorizontal: 16,
  },
});