/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';

import { styles } from './TransactionHistory.styles';
import { THEME } from '@/constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { AccountStackParamList } from '@/navigation/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// --- Types & Interfaces ---

interface Transaction {
    id: string;
    title: string;
    amount: string;
    reference: string;
    date: string;
    status: 'ENROLLED' | 'COMPLETED' | 'PENDING';
    type: 'credit' | 'debit';
    bgType: 'dark' | 'green' | 'purple';
    accent: string;
}

interface TransactionHistoryProps {
    initialTitle?: string;
}

interface FilterTab {
    id: string;
    label: string;
}

interface DropdownChip {
    id: string;
    label: string;
    iconName: string;
}

interface NavItem {
    id: string;
    label: string;
    iconName: string;
    fill?: boolean;
}

// --- Config Maps (Constants) ---

const TRANSACTIONS_DATA: Transaction[] = [
  {
    id: '1',
    title: 'Private Limited Company Incorporation',
    amount: '₹12,390.00',
    reference: 'pay_Sqhl5TxSPc4A62',
    date: '16 May 2026, 3:24 PM',
    status: 'ENROLLED',
    type: 'debit',
    bgType: 'dark',
    accent: '#3B82F6', // soft blue
  },
  {
    id: '2',
    title: 'GST Filing - Q1 Services',
    amount: '- ₹4,500.00',
    reference: 'pay_Kk92pXmLA28z91',
    date: '14 May 2026, 11:10 AM',
    status: 'COMPLETED',
    type: 'debit',
    bgType: 'green',
    accent: '#10B981', // soft emerald
  },
  {
    id: '3',
    title: 'Wallet Top-up',
    amount: '+ ₹50,000.00',
    reference: 'tr_92817xMMB82L',
    date: '12 May 2026, 09:45 AM',
    status: 'COMPLETED',
    type: 'credit',
    bgType: 'purple',
    accent: '#8B5CF6', // soft violet
  },
];
const EARLIER_TRANSACTIONS: Transaction[] = [
    {
        id: '4',
        title: 'Trademark Registration',
        amount: '₹8,500.00',
        reference: 'pay_Aa82mLq921XX',
        date: '05 May 2026, 04:20 PM',
        status: 'COMPLETED',
        type: 'debit',
        bgType: 'dark',
        accent: THEME.colors.blue,
    },
];

const FILTER_TABS: FilterTab[] = [
    { id: 'all', label: 'All' },
    { id: 'credit', label: 'Credit' },
    { id: 'debit', label: 'Debit' },
    { id: 'pending', label: 'Pending' },
];

const DROPDOWN_CHIPS: DropdownChip[] = [
    { id: 'type', label: 'Type', iconName: 'expand-more' },
    { id: 'date', label: 'Date Range', iconName: 'calendar-today' },
    { id: 'status', label: 'Status', iconName: 'filter-list' },
];

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', iconName: 'home' },
    { id: 'history', label: 'History', iconName: 'receipt-long' },
    { id: 'transfer', label: 'Transfer', iconName: 'sync-alt' },
    { id: 'account', label: 'Account', iconName: 'person' },
];

const BG_MAP = {
  dark: '#F8FAFC',
  green: '#F0FDF4',
  purple: '#F5F3FF',
};

// --- Sub-components ---

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const iconName = transaction.title.includes('Wallet')
        ? 'account-balance-wallet'
        : transaction.title.includes('GST')
            ? 'receipt-long'
            : 'business-center';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.card,
                { backgroundColor: BG_MAP[transaction.bgType] },
            ]}
        >
            <View style={[styles.cardShimmer, { opacity: 0.6 }]} />
            <View style={styles.cardContent}>
                
                <View style={styles.cardMain}>
                    <View style={styles.cardTitleRow}>
                        <Text numberOfLines={1} style={styles.cardTitle}>{transaction.title}</Text>
                        <Text style={[
                            styles.cardAmount,
                            { color: transaction.type === 'credit' ? THEME.colors.green : "grey", fontSize : 12 }
                        ]}>
                            {transaction.amount}
                        </Text>
                    </View>
                    <Text style={styles.cardId}>{transaction.reference}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardDate}>{transaction.date}</Text>
                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor: `${transaction.accent}38`,
                                borderColor: `${transaction.accent}54`,
                            }
                        ]}>
                            <Text style={[styles.statusBadgeText, { color: transaction.accent }]}>
                                {transaction.status}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>{title}</Text>
            {count !== undefined && (
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{count}</Text>
                </View>
            )}
        </View>
        <TouchableOpacity>
            <Text style={styles.viewAnalyticsText}>View Analytics</Text>
        </TouchableOpacity>
    </View>
);

// --- Main Export ---

export default function TransactionHistory({ initialTitle = 'Transactions' }: TransactionHistoryProps) {
     const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
    const [activeTab, setActiveTab] = useState('all');
    const [activeNav, setActiveNav] = useState('history');

    return (
        <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
            {/* Header */}
             <ScreenHeader
                    title="Trasaction History"
                    onBackPress={() => navigation.goBack()}
                  />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <MaterialIcons name="search" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Title / gateway / payment id..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterTabsScroll}
                    contentContainerStyle={styles.filterTabsContainer}
                >
                    {FILTER_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            style={[
                                styles.filterTab,
                                activeTab === tab.id && styles.filterTabActive,
                            ]}
                        >
                            <Text style={[
                                styles.filterTabText,
                                activeTab === tab.id && styles.filterTabTextActive,
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Dropdown Chips */}
                <View style={styles.dropdownChipsContainer}>
                    {DROPDOWN_CHIPS.map((chip) => {
                        return (
                            <TouchableOpacity key={chip.id} style={styles.dropdownChip}>
                                <Text style={styles.dropdownChipText}>{chip.label}</Text>
                                <MaterialIcons name={chip.iconName} size={16} color="#64748B" />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Recent Activity Section */}
                <SectionHeader title="Recent Activity" count={3} />
                <View style={styles.transactionList}>
                    {TRANSACTIONS_DATA.map((item) => (
                        <TransactionCard key={item.id} transaction={item} />
                    ))}
                </View>

                {/* Earlier This Month Section */}
                <View style={styles.dateSeparator}>
                    <Text style={styles.separatorText}>Earlier This Month</Text>
                    <View style={styles.separatorLine} />
                </View>

                <View style={styles.transactionList}>
                    {EARLIER_TRANSACTIONS.map((item) => (
                        <TransactionCard key={item.id} transaction={item} />
                    ))}
                </View>

                {/* Extra Space for Bottom Nav */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaWrapper>
    );
}
