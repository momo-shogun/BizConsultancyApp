import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectDisplayName,
  selectHasVerifiedLogin,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';
import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';
import { formatIndianMobile } from '@/utils/formatPhone';
import { Card } from '@/shared/components/card';

import { ProfileScreenHeaderChrome } from '@/features/Profile/components/ProfileScreenHeaderChrome';
import { ProfileSignInGate } from '@/features/Profile/components/ProfileSignInGate';
import { useConsultantAccountProfile } from '@/features/Profile/hooks/useAccountProfileHydration';
import { useConsultantBusinessOverview } from '@/features/Profile/hooks/useConsultantBusinessOverview';
import type { ConsultantBusinessOverviewStat } from '@/features/Profile/hooks/useConsultantBusinessOverview';
import { useNavigateToLogin } from '@/features/Profile/hooks/useNavigateToLogin';
import { useProfileLoginPrompt } from '@/features/Profile/hooks/useProfileLoginPrompt';
import { useUserProfileMembershipSection } from '@/features/Profile/hooks/useUserProfileMembershipSection';

import { styles } from './ConsultantProfileScreen.styles';

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
      <Text style={headerBtnStyles.btnText}>Settings</Text>
    </Pressable>
  );
}

const headerBtnStyles = StyleSheet.create({
  btn: {
    minWidth: 40,
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  item: ConsultantBusinessOverviewStat;
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
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const displayName = useAppSelector(selectDisplayName);
  const storedMobile = useAppSelector(selectLoggedInMobile);
  const navigateToLogin = useNavigateToLogin();
  const { promptLogin, profileLoginDialog } = useProfileLoginPrompt();

  const { profile } = useConsultantAccountProfile();
  const membership = useUserProfileMembershipSection({
    enabled: hasVerifiedLogin,
    membershipLine: 'experts',
  });
  const { stats: businessOverviewStats } = useConsultantBusinessOverview(hasVerifiedLogin);

  const heroName = useMemo((): string => {
    if (!hasVerifiedLogin) {
      return 'Guest';
    }
    const fromApi = profile?.name?.trim();
    if (fromApi != null && fromApi.length > 0) {
      return fromApi;
    }
    const fromStore = displayName?.trim();
    if (fromStore != null && fromStore.length > 0) {
      return fromStore;
    }
    return 'My profile';
  }, [displayName, hasVerifiedLogin, profile?.name]);

  const heroSubtitle = useMemo((): string | undefined => {
    if (!hasVerifiedLogin) {
      return 'Sign in to unlock your consultant profile';
    }
    const mobile = profile?.mobile?.trim() ?? storedMobile?.trim() ?? '';
    if (mobile.length === 0) {
      return undefined;
    }
    return formatIndianMobile(mobile) ?? mobile;
  }, [hasVerifiedLogin, profile?.mobile, storedMobile]);

  const avatarUri = hasVerifiedLogin ? (profile?.thumbnail ?? null) : null;
  const avatarInitial = hasVerifiedLogin ? (heroName ?? 'C').charAt(0).toUpperCase() : 'G';
  const membershipLabel = useMemo((): string | undefined => {
    if (!hasVerifiedLogin) {
      return undefined;
    }
    if (membership.isLoading) {
      return 'Loading plan...';
    }
    if (membership.hasPlan) {
      return membership.planName;
    }
    return 'No active plan';
  }, [hasVerifiedLogin, membership.hasPlan, membership.isLoading, membership.planName]);

  const statCardWidth = useMemo((): number => {
    const inner = screenWidth - THEME.spacing[16] * 2 - GRID_GAP;
    return Math.floor(inner / 2);
  }, [screenWidth]);

  const openEditProfile = useCallback((): void => {
    if (!hasVerifiedLogin) {
      promptLogin({
        role: 'consultant',
        message: 'Log in to edit your photo, fees, summary, and professional details.',
      });
      return;
    }
    navigation.navigate(ROUTES.Account.EditProfile);
  }, [hasVerifiedLogin, navigation, promptLogin]);

  const openHelpSettings = useCallback((): void => {
    if (!hasVerifiedLogin) {
      promptLogin({
        role: 'consultant',
        title: 'Sign in for settings',
        message:
          'Help and settings are available after you log in. Verify your mobile number to continue.',
      });
      return;
    }
    navigation.navigate(ROUTES.Account.HelpSettings);
  }, [hasVerifiedLogin, navigation, promptLogin]);

  return (
    <>
      <ProfileScreenHeaderChrome
        title="My Profile"
        avatarUri={avatarUri}
        avatarInitial={avatarInitial}
        displayName={heroName}
        displaySubtitle={heroSubtitle}
        membershipLabel={membershipLabel}
        onMembershipPress={hasVerifiedLogin ? membership.onMembershipPress : undefined}
        onAvatarPress={openEditProfile}
        rightAction={<SettingsHeaderButton onPress={openHelpSettings} />}
      >
        <Animated.ScrollView
          style={styles.screen}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={onBizAiScroll}
          scrollEventThrottle={16}
        >
          {hasVerifiedLogin ? (
            <>
              <View style={styles.section}>
                <SectionHeading title="Business overview" />
                <View style={styles.statsGrid}>
                  {businessOverviewStats.map((stat) => (
                    <StatCard key={stat.id} item={stat} width={statCardWidth} />
                  ))}
                </View>
              </View>
            </>
          ) : (
            <ProfileSignInGate onSignIn={() => navigateToLogin('consultant')} />
          )}
        </Animated.ScrollView>
      </ProfileScreenHeaderChrome>
      {profileLoginDialog}
    </>
  );
}
