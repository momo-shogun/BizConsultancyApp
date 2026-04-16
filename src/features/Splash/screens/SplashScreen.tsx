import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenWrapper } from '@/shared/components';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Splash>;

export function SplashScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace(ROUTES.Auth.Landing);
    }, 800);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.brand}>BizConsultancy</Text>
          <Text style={styles.tagline}>Consulting made simple</Text>
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    gap: THEME.spacing[8],
  },
  brand: {
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
  },
  tagline: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
});

