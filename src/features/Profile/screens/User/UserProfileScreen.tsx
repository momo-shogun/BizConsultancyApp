import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

import { ProfileScreenHeaderChrome } from '@/features/Profile/components/ProfileScreenHeaderChrome';
import { ProfileSignInGate } from '@/features/Profile/components/ProfileSignInGate';
import { UserProfileMembershipSection } from '@/features/Profile/components/UserProfileMembershipSection';
import { useGetUserMeQuery } from '@/features/Profile/api/userProfileApi';
import { useNavigateToLogin } from '@/features/Profile/hooks/useNavigateToLogin';
import { useProfileLoginPrompt } from '@/features/Profile/hooks/useProfileLoginPrompt';

import { styles } from './UserProfileScreen.styles';

type AccountNav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.Home>;

function SettingsHeaderButton(props: { onPress: () => void }): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open settings menu"
      onPress={props.onPress}
      style={({ pressed }) => [headerBtnStyles.btn, pressed ? headerBtnStyles.btnPressed : null]}
    >
      <Ionicons name="menu-outline" size={22} color="#FFFFFF" />
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

export function UserProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();
  const onBizAiScroll = useBizAIScrollReporter();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const displayName = useAppSelector(selectDisplayName);
  const storedMobile = useAppSelector(selectLoggedInMobile);
  const navigateToLogin = useNavigateToLogin();
  const { promptLogin, profileLoginDialog } = useProfileLoginPrompt();

  const { data: profile } = useGetUserMeQuery(undefined, { skip: !hasVerifiedLogin });

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
      return 'Sign in to unlock your profile';
    }
    const mobile = profile?.mobile?.trim() ?? storedMobile?.trim() ?? '';
    if (mobile.length === 0) {
      return undefined;
    }
    return formatIndianMobile(mobile) ?? mobile;
  }, [hasVerifiedLogin, profile?.mobile, storedMobile]);

  const avatarUri = hasVerifiedLogin ? (profile?.thumbnail ?? null) : null;
  const avatarInitial = hasVerifiedLogin ? (heroName ?? 'U').charAt(0).toUpperCase() : 'G';

  const openEditProfile = useCallback((): void => {
    if (!hasVerifiedLogin) {
      promptLogin({
        message: 'Log in to edit your profile photo, email, and location.',
      });
      return;
    }
    navigation.navigate(ROUTES.Account.EditProfile);
  }, [hasVerifiedLogin, navigation, promptLogin]);

  const openHelpSettings = useCallback((): void => {
    if (!hasVerifiedLogin) {
      promptLogin({
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
                  <Text style={styles.editProfileSubtitle}>Update photo, email & location</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <UserProfileMembershipSection />
            </>
          ) : (
            <ProfileSignInGate onSignIn={() => navigateToLogin('user')} />
          )}
        </Animated.ScrollView>
      </ProfileScreenHeaderChrome>
      {profileLoginDialog}
    </>
  );
}
