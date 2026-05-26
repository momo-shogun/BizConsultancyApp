import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

import { ProfileAccountCard } from '@/features/Profile/components/ProfileAccountCard';
import { ProfileScreenHeaderChrome } from '@/features/Profile/components/ProfileScreenHeaderChrome';
import { UserProfileMembershipSection } from '@/features/Profile/components/UserProfileMembershipSection';
import { useGetUserMeQuery } from '@/features/Profile/api/userProfileApi';

import { styles } from './UserProfileScreen.styles';

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

export function UserProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();
  const onBizAiScroll = useBizAIScrollReporter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const storedMobile = useAppSelector(selectLoggedInMobile);

  const { data: profile } = useGetUserMeQuery(undefined, { skip: !isAuthenticated });

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
  const avatarInitial = (heroName ?? 'U').charAt(0).toUpperCase();

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
                <Text style={styles.editProfileSubtitle}>Update photo, email & location</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <UserProfileMembershipSection />
          </>
        ) : (
          <ProfileAccountCard accountRole="user" style={styles.accountCard} />
        )}
      </Animated.ScrollView>
    </ProfileScreenHeaderChrome>
  );
}
