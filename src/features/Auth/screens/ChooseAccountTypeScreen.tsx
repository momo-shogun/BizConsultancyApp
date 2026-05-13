import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { SafeAreaWrapper } from '@/shared/components';

import lightLogo from '@/assets/lightlogo.png';

type Nav = NativeStackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

type Rt = RouteProp<
  AuthStackParamList,
  typeof ROUTES.Auth.ChooseAccountType
>;

type Role = 'user' | 'consultant';

const ACCENT = THEME.colors.accentAmber;
const PAGE_BG = THEME.colors.white;
const CARD_BORDER = THEME.colors.border;
const TITLE_COLOR = THEME.colors.textPrimary;
const SUBTITLE_COLOR = THEME.colors.textSecondary;

function RadioIndicator(props: { selected: boolean }): React.ReactElement {
  return (
    <View
      style={[styles.radioOuter, props.selected && styles.radioOuterSelected]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {props.selected ? <View style={styles.radioInner} /> : null}
    </View>
  );
}

function ConcentricArt(props: { variant: Role }): React.ReactElement {
  const rings = [88, 62, 38];
  const icons =
    props.variant === 'user'
      ? (
          <>
            <View style={[styles.floatDot, styles.floatBlue, { top: 6, right: 8 }]}>
              <Ionicons name="calendar-outline" size={11} color={THEME.colors.white} />
            </View>
            <View style={[styles.floatDot, styles.floatGreen, { bottom: 18, right: 2 }]}>
              <Ionicons name="checkmark" size={12} color={THEME.colors.white} />
            </View>
            <View style={[styles.floatDot, styles.floatPurple, { top: 36, left: 0 }]}>
              <Ionicons name="person-outline" size={11} color={THEME.colors.white} />
            </View>
          </>
        )
      : (
          <>
            <View style={[styles.floatDot, styles.floatBlue, { top: 10, right: 6 }]}>
              <Ionicons name="logo-youtube" size={10} color={THEME.colors.white} />
            </View>
            <View style={[styles.floatDot, styles.floatPurple, { bottom: 20, right: 4 }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={10} color={THEME.colors.white} />
            </View>
            <View style={[styles.floatDot, styles.floatGreen, { top: 32, left: 2 }]}>
              <Ionicons name="briefcase-outline" size={11} color={THEME.colors.white} />
            </View>
          </>
        );

  return (
    <View style={styles.artRoot} pointerEvents="none">
      {rings.map((size, index) => (
        <View
          key={size}
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: 0.35 + index * 0.18,
            },
          ]}
        />
      ))}
      {icons}
    </View>
  );
}

interface RoleCardProps {
  variant: Role;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  accessibilityLabel: string;
}

function RoleCard(props: RoleCardProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: props.selected }}
      accessibilityLabel={props.accessibilityLabel}
      onPress={props.onSelect}
      style={({ pressed }) => [
        styles.roleCard,
        props.selected ? styles.roleCardSelected : styles.roleCardIdle,
        pressed ? styles.roleCardPressed : null,
      ]}
    >
      <View style={styles.roleCardRow}>
        <RadioIndicator selected={props.selected} />
        <View style={styles.roleTextCol}>
          <Text style={styles.roleTitle}>{props.title}</Text>
          <Text style={styles.roleDesc}>{props.description}</Text>
        </View>
        <ConcentricArt variant={props.variant} />
      </View>
    </Pressable>
  );
}

export function ChooseAccountTypeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { width: windowWidth } = useWindowDimensions();
  const { selectAccountContext } = useAuth();

  const next = route.params.next ?? 'login';
  const [role, setRole] = useState<Role | null>(null);

  const subtitleMaxWidth = Math.min(400, windowWidth - 40);

  const choose = useCallback(
    (userType: Role): void => {
      selectAccountContext({
        userType,
        authIntent: next,
      });
      navigation.replace(
        next === 'login'
          ? ROUTES.Auth.Login
          : ROUTES.Auth.Signup
      );
    },
    [navigation, next, selectAccountContext],
  );

  const onContinue = useCallback((): void => {
    if (role != null) {
      choose(role);
    }
  }, [choose, role]);

  const onBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <View style={styles.page}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollInner}
        >
          <View style={styles.logoRow}>
            <Image
              source={lightLogo}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="BizConsultancy"
            />
          </View>

          <Text style={styles.stepLabel}>Step 1 of 2</Text>
          <Text style={styles.screenTitle}>Choose your role</Text>
          <Text style={[styles.screenSubtitle, { maxWidth: subtitleMaxWidth }]}>
            Select your role to personalize your experience — User or Consultant.
          </Text>

          <View style={styles.cardsStack} accessibilityRole="radiogroup" accessibilityLabel="Account role">
            <RoleCard
              variant="user"
              title="User"
              description="Book experts and manage your sessions."
              selected={role === 'user'}
              onSelect={() => setRole('user')}
              accessibilityLabel="User role. Book experts and manage sessions."
            />
            <RoleCard
              variant="consultant"
              title="Consultant"
              description="Host consultations and manage clients."
              selected={role === 'consultant'}
              onSelect={() => setRole('consultant')}
              accessibilityLabel="Consultant role. Host consultations and manage clients."
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={({ pressed }) => [styles.btnBack, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnBackText}>Back</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue to next step"
            accessibilityState={{ disabled: role == null }}
            onPress={onContinue}
            disabled={role == null}
            style={({ pressed }) => [
              styles.btnNext,
              role == null && styles.btnNextDisabled,
              pressed && role != null && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnNextText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  logoRow: {
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  logoImage: {
    height: 40,
    width: 200,
    maxWidth: '100%',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: THEME.typography.weight.bold as '700',
    color: TITLE_COLOR,
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 10,
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: SUBTITLE_COLOR,
    marginBottom: 28,
  },
  cardsStack: {
    gap: 14,
  },
  roleCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 118,
    justifyContent: 'center',
    backgroundColor: PAGE_BG,
  },
  roleCardIdle: {
    borderColor: CARD_BORDER,
  },
  roleCardSelected: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  roleCardPressed: {
    opacity: 0.92,
  },
  roleCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: ACCENT,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },
  roleTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: THEME.typography.weight.bold as '700',
    color: TITLE_COLOR,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: SUBTITLE_COLOR,
  },
  artRoot: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  floatDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatBlue: { backgroundColor: '#3B82F6' },
  floatGreen: { backgroundColor: '#22C55E' },
  floatPurple: { backgroundColor: '#A855F7' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: PAGE_BG,
  },
  btnBack: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: PAGE_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackText: {
    fontSize: 16,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: TITLE_COLOR,
  },
  btnNext: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: TITLE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNextDisabled: {
    opacity: 0.38,
  },
  btnNextText: {
    fontSize: 16,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  btnPressed: {
    opacity: 0.88,
  },
});
