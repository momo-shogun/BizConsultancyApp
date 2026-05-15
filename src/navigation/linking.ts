import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';
import { ROUTES } from './routeNames';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['bizconsultancy://'],
  config: {
    screens: {
      [ROUTES.Root.Auth]: {
        screens: {
          [ROUTES.Auth.Splash]: 'splash',
          [ROUTES.Auth.Landing]: 'landing',
          [ROUTES.Auth.ChooseAccountType]: 'choose-account-type/:next?',
          [ROUTES.Auth.Login]: 'login',
          [ROUTES.Auth.Signup]: 'signup',
          [ROUTES.Auth.OtpVerification]: 'otp',
          [ROUTES.Auth.ProfileSetup]: 'profile-setup',
        },
      },
      [ROUTES.Root.App]: {
        screens: {
          [ROUTES.App.Home]: 'home',
          [ROUTES.App.Services]: {
            path: 'services',
            screens: {
              [ROUTES.Services.List]: '',
              [ROUTES.Services.Detail]: ':slug',
              [ROUTES.Services.Onboarding]: ':slug/onboarding',
            },
          },
          [ROUTES.App.Account]: {
            path: 'account',
            screens: {
              [ROUTES.Account.Home]: '',
              [ROUTES.Account.HelpSettings]: 'settings',
            },
          },
        },
      },
      [ROUTES.Root.ConsultantsList]: 'consultants',
      [ROUTES.Root.ConsultantDetail]: 'consultant/:slug',
    },
  },
};

