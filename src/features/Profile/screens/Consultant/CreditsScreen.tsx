import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '@/constants/theme';
import { styles } from './CreditsScreen.styles';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AccountStackParamList } from '@/navigation/types';

// --- Interfaces ---

interface CreditPackProps {
    id: string;
    credits: number;
    price: number;
    description: string;
    bonus?: string;
    accent: 'blue' | 'green' | 'purple';
    isBestValue?: boolean;
}

interface NavItemProps {
    label: string;
    iconName: string;
    active?: boolean;
}

// --- Constants ---

const CREDIT_PACKS: CreditPackProps[] = [
    {
        id: '1',
        credits: 100,
        price: 100,
        description: 'Standard Usage Pack',
        accent: 'blue',
    },
    {
        id: '2',
        credits: 260,
        price: 250,
        description: 'INR 250 → 260 credits',
        bonus: 'BONUS',
        accent: 'blue',
        isBestValue: true,
    },
    {
        id: '3',
        credits: 550,
        price: 500,
        description: 'INR 500 → 550 credits',
        bonus: '+50 EXTRA',
        accent: 'green',
    },
    {
        id: '4',
        credits: 1200,
        price: 1000,
        description: 'INR 1000 → 1200 credits',
        bonus: '+200 EXTRA',
        accent: 'purple',
    },
];

const NAV_ITEMS: NavItemProps[] = [
    { label: 'Home', iconName: 'home' },
    { label: 'History', iconName: 'clock' },
    { label: 'Transfer', iconName: 'repeat' },
    { label: 'Account', iconName: 'account', active: true },
];

// LIGHT THEME COLORS

const ACCENT_MAP = {
  blue: {
    bg: '#F8FAFC',
    accent: '#3B82F6',
  },
  green: {
    bg: '#F0FDF4',
    accent: '#10B981',
  },
  purple: {
    bg: '#F5F3FF',
    accent: '#8B5CF6',
  },
};

// --- Sub-components ---

const PackCard: React.FC<CreditPackProps> = ({
    credits,
    price,
    description,
    bonus,
    accent,
    isBestValue,
}) => {
    const theme = ACCENT_MAP[accent];

    return (
        <View style={[styles.packCard, { backgroundColor: theme.bg }]}>
            <View
                style={[
                    styles.shimmerLine,
                    { backgroundColor: theme.accent, opacity: 0.6 }
                ]}
            />
            {isBestValue && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: THEME.colors.black,
                    paddingHorizontal: 12,
                    borderBottomLeftRadius: 10,
                }}>
                    <Text style={{ color: THEME.colors.white, fontSize: 10, fontWeight: '500' ,  }}>BEST VALUE</Text>
                </View>
            )}

            <View style={styles.packHeader}>
                <View style={{ flex: 1 }}>
                    <View style={styles.packTitleContainer}>
                        <Text style={styles.packTitle}>{credits} Credits</Text>
                        {bonus && (
                            <View style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: `${theme.accent}38`, // 22% approx
                                    borderColor: `${theme.accent}54` // 33% approx
                                }
                            ]}>
                                <Text style={[styles.statusText, { color: theme.accent }]}>{bonus}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.packDescription}>{description}</Text>
                </View>

                <View style={styles.packPriceContainer}>
                    <Text style={styles.packPrice}>₹{price}</Text>
                    {credits === 100 && <Text style={styles.packPriceUnit}>₹1 / CREDIT</Text>}
                </View>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.secondaryButton}>
                    <MaterialCommunityIcons name="wallet" size={18} color={THEME.colors.white} />
                    <Text style={styles.secondaryButtonText}>Pay with wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryButton, { backgroundColor: THEME.colors.white }]}>
                    <MaterialCommunityIcons name="credit-card" size={18} color={THEME.colors.black} />
                    <Text style={styles.primaryButtonText}>Pay with Razorpay</Text>
                </TouchableOpacity>

                {credits === 100 && (
                    <View style={styles.insufficientTextContainer}>
                        <MaterialCommunityIcons name="information" size={14} color="#EF4444" />
                        <Text style={styles.insufficientText}>
                            Insufficient wallet balance. Top up or use Razorpay.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const SectionHeader: React.FC<{ title: string; count?: number }> = ({ title, count }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && (
            <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
            </View>
        )}
    </View>
);

const NavItem: React.FC<NavItemProps> = ({ label, iconName, active }) => (
    <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={active ? THEME.colors.white : THEME.colors.textSecondary}
            style={{ opacity: active ? 1 : 0.6 }}
        />
        <Text style={[
            styles.navLabel,
            { color: active ? THEME.colors.white : THEME.colors.textSecondary, opacity: active ? 1 : 0.6 }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

// --- Main Component ---

export default function CreditsScreen() {
     const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
    return (
           <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
              <ScreenHeader
                title="Biz AI Credits"
                onBackPress={() => navigation.goBack()}
              />
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerTitleContainer}>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={THEME.colors.white} />
                        </TouchableOpacity>
                       <View style={{ flexDirection: 'column' }}>
  <Text style={styles.headerTitle}>
    Buy Biz AI Credits
  </Text>

  <Text
    style={{
      fontSize: 13,
      color: '#64748B',
      lineHeight: 18,
      maxWidth: 260,
      paddingBottom : 20
    }}
  >
    Purchase credit packs to keep using Biz AI after your free questions.
  </Text>
</View>
                    </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <View style={styles.balanceValueContainer}>
                        <Text style={styles.balanceValue}>0</Text>
                        <Text style={styles.balanceUnit}>Credits</Text>
                    </View>
                    <TouchableOpacity style={styles.refreshButton}>
                        <MaterialCommunityIcons name="refresh" size={14} color={THEME.colors.white} />
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                </View>

                {/* Wallet Section */}
                <View style={styles.walletSection}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconInner, { backgroundColor: `${THEME.colors.accentAmber}21` }]}>
                            <MaterialCommunityIcons name="wallet" size={20} color={THEME.colors.black} />
                        </View>
                    </View>
                    <View style={styles.walletInfo}>
                        <Text style={styles.walletTitle}>Consultant Wallet</Text>
                        <Text style={styles.walletSubtitle}>1-click instant purchases</Text>
                    </View>
                    <View style={styles.walletBalance}>
                        <Text style={styles.walletAmount}>INR 0.00</Text>
                        <TouchableOpacity>
                            <Text style={styles.topUpLink}>Top up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Credit Packs */}
                <SectionHeader title="Select Credit Pack" />

                {CREDIT_PACKS.map((pack) => (
                    <PackCard key={pack.id} {...pack} />
                ))}
            </ScrollView>
        </SafeAreaWrapper>
    );
}
