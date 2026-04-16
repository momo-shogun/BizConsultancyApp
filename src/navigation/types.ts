import type { NavigatorScreenParams } from '@react-navigation/native';

import { ROUTES } from './routeNames';

export type AuthStackParamList = {
  [ROUTES.Auth.Splash]: undefined;
  [ROUTES.Auth.Landing]: undefined;
  [ROUTES.Auth.Login]: undefined;
  [ROUTES.Auth.Signup]: undefined;
  [ROUTES.Auth.OtpVerification]: { contact: string };
  [ROUTES.Auth.ProfileSetup]: undefined;
};

export type AppTabParamList = {
  [ROUTES.App.Home]: undefined;
  [ROUTES.App.Services]: undefined;
  [ROUTES.App.Bookings]: undefined;
  [ROUTES.App.Wallet]: undefined;
  [ROUTES.App.Account]: undefined;
};

export type RootStackParamList = {
  [ROUTES.Root.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.Root.App]: NavigatorScreenParams<AppTabParamList>;
};

