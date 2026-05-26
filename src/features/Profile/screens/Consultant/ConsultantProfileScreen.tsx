import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';
import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';
import { formatIndianMobile } from '@/utils/formatPhone';
import { Card } from '@/shared/components/card';

import { ProfileAccountCard } from '@/features/Profile/components/ProfileAccountCard';
import { ProfileScreenHeaderChrome } from '@/features/Profile/components/ProfileScreenHeaderChrome';
import { UserProfileMembershipSection } from '@/features/Profile/components/UserProfileMembershipSection';
import { useGetConsultantMyProfileQuery } from '@/features/Profile/api/consultantProfileApi';

import { styles } from './ConsultantProfileScreen.styles';

type StatIconName = React.ComponentProps<typeof Ionicons>['name'];

interface ConsultantStatItem {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: StatIconName;
  iconColor: string;
  iconBg: string;
  accentBorder: string;
  valueMuted?: boolean;
}

const CONSULTANT_STATS: ConsultantStatItem[] = [
  {
    id: 'earnings',
    label: 'Total earnings',
    value: '₹0.00',
    subtitle: 'All paid bookings credited to your wallet.',
    icon: 'wallet-outline',
    iconColor: '#0D9488',
    iconBg: 'rgba(13,148,136,0.10)',
    accentBorder: '#0D9488',
    valueMuted: true,
  },
  {
    id: 'bookings',
    label: 'Total bookings',
    value: '0',
    subtitle: 'Confirmed sessions across all time.',
    icon: 'calendar-outline',
    iconColor: '#2563EB',
    iconBg: 'rgba(37,99,235,0.10)',
    accentBorder: '#2563EB',
    valueMuted: true,
  },
  {
    id: 'upcoming',
    label: 'Upcoming sessions',
    value: '0',
    subtitle: 'Next few bookings from your calendar.',
    icon: 'time-outline',
    iconColor: '#D97706',
    iconBg: 'rgba(217,119,6,0.10)',
    accentBorder: '#D97706',
    valueMuted: true,
  },
  {
    id: 'rating',
    label: 'Rating & review',
    value: '—',
    subtitle: 'Public rating surface coming soon.',
    icon: 'star-outline',
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.10)',
    accentBorder: '#7C3AED',
    valueMuted: true,
  },
];

type AccountNav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.Home>;

function SettingsHeaderButton(props: { onPress: () => void }): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Help and settings"
      onPress={props.onPress}
      style={({ pressed }) => [headerBtnStyles.btn, pressed ? headerBtnStyles.btnPressed : null]}
    >
      <Ionicons name="options-outline" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const headerBtnStyles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  btnPressed: {
    opacity: 0.88,
  },
});

function SectionHeading(props: { title: string }): React.ReactElement {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

interface StatCardProps {
  item: ConsultantStatItem;
  width: number;
}

function StatCard(props: StatCardProps): React.ReactElement {
  const { item, width } = props;

  return (
    <Card
      style={[styles.statCard, { width, borderLeftColor: item.accentBorder }]}
      accessibilityRole="text"
      accessibilityLabel={`${item.label}, ${item.value}. ${item.subtitle}`}
    >
      <View style={styles.statCardTop}>
        <Text style={styles.statLabel}>{item.label}</Text>
        <View style={[styles.statIconWrap, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={18} color={item.iconColor} />
        </View>
      </View>
      <View>
        <Text
          style={[styles.statValue, item.valueMuted ? styles.statValueMuted : null]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {item.value}
        </Text>
        <Text style={styles.statSubtitle}>{item.subtitle}</Text>
      </View>
    </Card>
  );
}

const GRID_GAP = THEME.spacing[10];

export function ConsultantProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();
  const onBizAiScroll = useBizAIScrollReporter();
  const { width: screenWidth } = useWindowDimensions();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const storedMobile = useAppSelector(selectLoggedInMobile);

  const { data: profile } = useGetConsultantMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const heroName = useMemo((): string | undefined => {
    const fromApi = profile?.name?.trim();
    if (fromApi != null && fromApi.length > 0) {
      return fromApi;
    }
    const fromStore = displayName?.trim();
    if (fromStore != null && fromStore.length > 0) {
      return fromStore;
    }
    return undefined;
  }, [displayName, profile?.name]);

  const heroSubtitle = useMemo((): string | undefined => {
    const mobile = profile?.mobile?.trim() ?? storedMobile?.trim() ?? '';
    if (mobile.length === 0) {
      return undefined;
    }
    return formatIndianMobile(mobile) ?? mobile;
  }, [profile?.mobile, storedMobile]);

  const avatarUri = profile?.thumbnail ?? null;
  const avatarInitial = (heroName ?? 'C').charAt(0).toUpperCase();

  const statCardWidth = useMemo((): number => {
    const inner = screenWidth - THEME.spacing[16] * 2 - GRID_GAP;
    return Math.floor(inner / 2);
  }, [screenWidth]);

  const openEditProfile = (): void => {
    navigation.navigate(ROUTES.Account.EditProfile);
  };

  const openHelpSettings = (): void => {
    navigation.navigate(ROUTES.Account.HelpSettings);
  };

  return (
    <ProfileScreenHeaderChrome
      title="My Profile"
      avatarUri={isAuthenticated ? avatarUri : null}
      avatarInitial={avatarInitial}
      displayName={heroName}
      displaySubtitle={heroSubtitle}
      onAvatarPress={isAuthenticated ? openEditProfile : undefined}
      rightAction={<SettingsHeaderButton onPress={openHelpSettings} />}
    >
      <Animated.ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={onBizAiScroll}
        scrollEventThrottle={16}
      >
        {isAuthenticated ? (
          <>
            <Pressable
              style={styles.editProfileRow}
              onPress={openEditProfile}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <View style={styles.editProfileIcon}>
                <Ionicons name="create-outline" size={18} color={THEME.colors.primary} />
              </View>
              <View style={styles.editProfileTextBlock}>
                <Text style={styles.editProfileTitle}>Edit profile</Text>
                <Text style={styles.editProfileSubtitle}>
                  Photo, fees, summary & professional details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <UserProfileMembershipSection membershipLine="experts" />

            <View style={styles.section}>
              <SectionHeading title="Business overview" />
              <View style={styles.statsGrid}>
                {CONSULTANT_STATS.map((stat) => (
                  <StatCard key={stat.id} item={stat} width={statCardWidth} />
                ))}
              </View>
            </View>
          </>
        ) : (
          <ProfileAccountCard accountRole="consultant" style={styles.accountCard} />
        )}
      </Animated.ScrollView>
    </ProfileScreenHeaderChrome>
  );
}
