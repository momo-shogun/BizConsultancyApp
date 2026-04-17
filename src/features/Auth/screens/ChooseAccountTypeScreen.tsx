import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.ChooseAccountType>;
type Rt = RouteProp<AuthStackParamList, typeof ROUTES.Auth.ChooseAccountType>;

export function ChooseAccountTypeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { selectAccountContext } = useAuth();

  const next = route.params.next ?? 'login';

  const choose = (userType: 'user' | 'consultant'): void => {
    selectAccountContext({ userType, authIntent: next });
    navigation.replace(next === 'login' ? ROUTES.Auth.Login : ROUTES.Auth.Signup);
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenWrapper style={styles.screen}>
        <Text style={styles.title}>Choose account type</Text>
        <Text style={styles.subtitle}>Select User or Consultant to continue.</Text>

        <View style={styles.actions}>
          <Button
            label="User"
            accessibilityLabel="Choose user account type"
            onPress={() => choose('user')}
          />
          <Button
            label="Consultant"
            accessibilityLabel="Choose consultant account type"
            variant="secondary"
            onPress={() => choose('consultant')}
          />
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: THEME.spacing[24],
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.size[22],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    marginTop: THEME.spacing[24],
    gap: THEME.spacing[12],
  },
});

