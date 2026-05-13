import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from './types';
import { ROUTES } from './routeNames';

import { SplashScreen } from '@/features/Splash/screens/SplashScreen';
import { LandingScreen } from '@/features/Auth/screens/LandingScreen';
import { ChooseAccountTypeScreen } from '@/features/Auth/screens/ChooseAccountTypeScreen';
import { LoginScreen } from '@/features/Auth/screens/LoginScreen';
import { SignupScreen } from '@/features/Auth/screens/SignupScreen';
import { OTPVerificationScreen } from '@/features/Auth/screens/OTPVerificationScreen';
import { ProfileSetupScreen } from '@/features/Auth/screens/ProfileSetupScreen';
import Edp from '@/features/Edp/screens/Edp';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName={ROUTES.Auth.Splash} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.Auth.Splash} component={SplashScreen} />
      <Stack.Screen name={ROUTES.Auth.Landing} component={LandingScreen} />
      <Stack.Screen name={ROUTES.Auth.ChooseAccountType} component={ChooseAccountTypeScreen} />
      <Stack.Screen name={ROUTES.Auth.Login} component={LoginScreen} />
      <Stack.Screen name={ROUTES.Auth.Signup} component={SignupScreen} />
      <Stack.Screen name={ROUTES.Auth.OtpVerification} component={OTPVerificationScreen} />
      <Stack.Screen name={ROUTES.Auth.ProfileSetup} component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

