import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  AccountTypeCard,
  SafeAreaWrapper,
  ScrollWrapper,
} from '@/shared/components';

type Nav = NativeStackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

type Rt = RouteProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

const { width } = Dimensions.get('window');

export function ChooseAccountTypeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { selectAccountContext } = useAuth();

  const next = route.params.next ?? 'login';

  const choose = (userType: 'user' | 'consultant'): void => {
    selectAccountContext({
      userType,
      authIntent: next,
    });

    navigation.replace(
      next === 'login'
        ? ROUTES.Auth.Login
        : ROUTES.Auth.Signup
    );
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <LinearGradient
        colors={[
          THEME.colors.chooseAccountBg1,
          THEME.colors.chooseAccountBg2,
          THEME.colors.chooseAccountBg3,
        ]}
        style={styles.container}
      >
        <ScrollWrapper contentContainerStyle={styles.content}>
          <View style={styles.topGlow} />
          <View style={styles.bottomGlow} />

          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Get Started</Text>
            </View>

            <Text style={styles.title}>Choose your account</Text>

            <Text style={styles.subtitle}>
              Select how you want to continue. You can switch later.
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <AccountTypeCard
              title="User"
              description="Book experts & track sessions"
              iconName="person-outline"
              gradientColors={[
                THEME.colors.chooseAccountUserGrad1,
                THEME.colors.chooseAccountUserGrad2,
              ]}
              accessibilityLabel="Continue as user"
              onPress={() => choose('user')}
            />

            <AccountTypeCard
              title="Consultant"
              description="Manage clients & consultations"
              iconName="briefcase-outline"
              gradientColors={[
                THEME.colors.chooseAccountConsultantGrad1,
                THEME.colors.chooseAccountConsultantGrad2,
              ]}
              accessibilityLabel="Continue as consultant"
              onPress={() => choose('consultant')}
            />
          </View>
        </ScrollWrapper>
      </LinearGradient>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[24],
  },
  topGlow: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: THEME.colors.chooseAccountGlowUser,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: THEME.colors.chooseAccountGlowConsultant,
  },
  header: {
    marginBottom: THEME.spacing[24],
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.chooseAccountBadgeBg,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: THEME.spacing[16],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.chooseAccountBadgeText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: THEME.colors.chooseAccountTitle,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: THEME.spacing[12],
    fontSize: 14,
    lineHeight: 20,
    color: THEME.colors.chooseAccountSubtitle,
    maxWidth: width * 0.86,
  },
  cardsContainer: {
    gap: THEME.spacing[12],
  },
});