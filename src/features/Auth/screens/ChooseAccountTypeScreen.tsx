import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { SafeAreaWrapper, ScrollWrapper } from '@/shared/components';

type Nav = NativeStackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

type Rt = RouteProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

const { width } = Dimensions.get('window');

type AccountCardProps = {
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  onPress: () => void;
};

function AccountCard({
  title,
  description,
  icon,
  gradient,
  onPress,
}: AccountCardProps): React.ReactElement {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const animateIn = (): void => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.spring(translateY, {
        toValue: 4,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
    ]).start();
  };

  const animateOut = (): void => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <LinearGradient colors={gradient} style={styles.iconContainer}>
          <Icon name={icon} size={28} color={THEME.colors.chooseAccountIconOnGradient} />
        </LinearGradient>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="arrow-forward" size={18} color={THEME.colors.chooseAccountArrow} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

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
              Select how you want to continue and unlock a personalized experience.
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <AccountCard
              title="User"
              description="Book experts, explore services, and get personalized guidance."
              icon="person-outline"
              gradient={[
                THEME.colors.chooseAccountUserGrad1,
                THEME.colors.chooseAccountUserGrad2,
              ]}
              onPress={() => choose('user')}
            />

            <AccountCard
              title="Consultant"
              description="Grow your business, connect with clients, and offer expertise."
              icon="briefcase-outline"
              gradient={[
                THEME.colors.chooseAccountConsultantGrad1,
                THEME.colors.chooseAccountConsultantGrad2,
              ]}
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
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    marginBottom: 36,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.chooseAccountBadgeBg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.chooseAccountBadgeText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: THEME.colors.chooseAccountTitle,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 24,
    color: THEME.colors.chooseAccountSubtitle,
    maxWidth: width * 0.82,
  },
  cardsContainer: {
    gap: 18,
  },
  pressable: {
    borderRadius: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.chooseAccountCardBg,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.chooseAccountCardBorder2,
    shadowColor: THEME.colors.chooseAccountTitle,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.chooseAccountTitle,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.colors.chooseAccountSubtitle,
  },
  arrowContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME.colors.chooseAccountArrowBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});