import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { setAuthProfile } from '@/features/Auth/store/authSlice';
import { establishProfileSession } from '@/features/Auth/store/authThunks';
import { selectLoggedInMobile } from '@/features/Auth/store/authSelectors';
import { ROUTES } from '@/navigation/routeNames';
import { useAppDispatch } from '@/store/typedHooks';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, EmptyState, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { ProfileSetupScreenContent as UserProfileSetupContent } from '@/features/Auth/User/screens/ProfileSetupScreenContent';
import { ProfileSetupScreenContent as ConsultantProfileSetupContent } from '@/features/Auth/Consultant/screens/ProfileSetupScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.ProfileSetup>;

export function ProfileSetupScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const mobile = useAppSelector(selectLoggedInMobile);
  const { state, completeOnboarding } = useAuth();

  const handleFinish = async (fullName: string): Promise<void> => {
    const role = state.userType ?? 'consultant';
    const phone = mobile ?? '';

    dispatch(
      setAuthProfile({
        displayName: fullName,
        accountRole: role,
        ...(phone.length > 0 ? { mobile: phone } : {}),
      }),
    );

    await dispatch(
      establishProfileSession({
        mobile: phone,
        role,
        displayName: fullName,
      }),
    ).unwrap();

    completeOnboarding();
  };

  if (!state.userType) {
    const next = state.authIntent ?? 'login';
    return (
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenWrapper style={styles.wrapper}>
          <EmptyState title="Choose account type" description="Please select User or Consultant to continue." />
          <View style={styles.actionRow}>
            <Button
              label="Choose account type"
              accessibilityLabel="Choose account type"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next })}
            />
          </View>
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  return state.userType === 'user' ? (
    <UserProfileSetupContent onFinish={handleFinish} onBackPress={() => navigation.goBack()} />
  ) : (
    <ConsultantProfileSetupContent onFinish={handleFinish} onBackPress={() => navigation.goBack()} />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  actionRow: {
    marginTop: 16,
  },
});
