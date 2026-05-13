import type { NavigatorScreenParams } from '@react-navigation/native';

import { ROUTES } from './routeNames';

export type AuthStackParamList = {
  [ROUTES.Auth.Splash]: undefined;
  [ROUTES.Auth.Landing]: undefined;
  [ROUTES.Auth.ChooseAccountType]: { next?: 'login' | 'signup' };
  [ROUTES.Auth.Login]: undefined;
  [ROUTES.Auth.Signup]: undefined;
  [ROUTES.Auth.OtpVerification]: { contact: string };
  [ROUTES.Auth.ProfileSetup]: undefined;
};

export type ServicesStackParamList = {
  [ROUTES.Services.List]: undefined;
  [ROUTES.Services.Detail]: { slug: string };
};

export type EdpStackParamList = {
  [ROUTES.Edp.Main]: undefined;
  [ROUTES.Edp.Modules]: undefined;
};

export type AppTabParamList = {
  [ROUTES.App.Home]: undefined;
  [ROUTES.App.Services]: NavigatorScreenParams<ServicesStackParamList>;
  [ROUTES.App.Edp]: NavigatorScreenParams<EdpStackParamList>;
  [ROUTES.App.Account]: undefined;
  [ROUTES.App.ConsultantsList]: undefined;
};

export type RootStackParamList = {
  [ROUTES.Root.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.Root.App]: NavigatorScreenParams<AppTabParamList>;
};


// export type EdpStackParamList = {
//   [ROUTES.App.Edp]: undefined;
// };