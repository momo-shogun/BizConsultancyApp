import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, SafeAreaWrapper } from '@/shared/components';

import landingBackground from '@/assets/background.png';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Landing>;

export function LandingScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaWrapper edges={['bottom']} style={styles.safeRoot}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={landingBackground}
        style={styles.hero}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.35)',
            'rgba(0,0,0,0.12)',
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.92)',
            THEME.colors.background,
          ]}
          locations={[0, 0.22, 0.48, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* <View style={[styles.topBar, { paddingTop: insets.top + THEME.spacing[8] }]}>
          <View style={styles.topPill}>
            <Ionicons name="sparkles" size={14} color={THEME.colors.white} />
            <Text style={styles.topPillText}>Samadhan</Text>
          </View>
        </View> */}

        <View style={styles.bottomStack}>
          <View style={styles.copyBlock}>
            <View style={styles.pill}>
              <Ionicons name="briefcase-outline" size={14} color={THEME.colors.primary} />
              <Text style={styles.pillText}>Business & experts</Text>
            </View>
            <Text style={styles.title}>Grow with experts</Text>
            <Text style={styles.subtitle}>
              Consultancy, booking, and growth—built for how you work on mobile.
            </Text>
          </View>

          <View
            style={[
              styles.ctaBlock,
              { paddingBottom: Math.max(insets.bottom, THEME.spacing[12]) },
            ]}
          >
            <Button
              label="Log in"
              accessibilityLabel="Log in"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'login' })}
              style={styles.btnPrimary}
            />
            <Button
              label="Create account"
              accessibilityLabel="Create account"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'signup' })}
              style={styles.btnSecondary}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: THEME.colors.black,
  },
  hero: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    paddingHorizontal: THEME.spacing[16],
  },
  topPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  topPillText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
  bottomStack: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  copyBlock: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: THEME.colors.chooseAccountBadgeBg,
  },
  pillText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.chooseAccountBadgeText,
  },
  title: {
    fontSize: THEME.typography.size[28],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: THEME.colors.textSecondary,
    maxWidth: 340,
  },
  ctaBlock: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[8],
    gap: THEME.spacing[12],
    backgroundColor: THEME.colors.background,
    borderTopLeftRadius: THEME.radius[16],
    borderTopRightRadius: THEME.radius[16],
  },
  btnPrimary: {
    minHeight: 46,
    borderRadius: THEME.radius[12],
  },
  btnSecondary: {
    minHeight: 46,
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.white,
  },
});
