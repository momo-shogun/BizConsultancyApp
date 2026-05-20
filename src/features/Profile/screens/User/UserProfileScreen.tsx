import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';
import { ProfileAccountCard } from '@/features/Profile/components/ProfileAccountCard';
import { SafeAreaWrapper, ScreenWrapper } from '@/shared/components';

import { styles, USER_CANVAS } from './UserProfileScreen.styles';

type AccountNav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.Home>;

export function UserProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();
  const onBizAiScroll = useBizAIScrollReporter();

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={USER_CANVAS}
      contentBgColor={USER_CANVAS}
    >
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>My Profile</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help and settings"
          onPress={() => navigation.navigate(ROUTES.Account.HelpSettings)}
          style={({ pressed }) => [styles.settingsBtn, pressed ? { opacity: 0.88 } : null]}
        >
          <Ionicons name="settings-outline" size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.settingsBtnText}>Help & Settings</Text>
        </Pressable>
      </View>

      <ScreenWrapper style={styles.screen}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={onBizAiScroll}
          scrollEventThrottle={16}
        >
          <ProfileAccountCard accountRole="user" style={styles.subscriptionCard} />
        </Animated.ScrollView>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}
