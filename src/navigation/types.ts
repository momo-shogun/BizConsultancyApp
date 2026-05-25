import type { NavigatorScreenParams } from '@react-navigation/native';

import type { SearchScreenParams } from '@/features/Search/types/search.types';

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
  [ROUTES.Services.Onboarding]: { slug: string; submissionId?: number };
};

export type EdpStackParamList = {
  [ROUTES.Edp.Main]: undefined;
  [ROUTES.Edp.Modules]: undefined;
  [ROUTES.Edp.ModuleDetail]: undefined;
};

export type AccountStackParamList = {
  [ROUTES.Account.Home]: undefined;
  [ROUTES.Account.HelpSettings]: undefined;
  [ROUTES.Account.Membership]: undefined;
  [ROUTES.Account.EditProfile]: undefined;
  [ROUTES.Account.ConsultantBankDetailsScreen]: undefined;
  [ROUTES.Account.ExpertVideosScreen]: undefined;
  [ROUTES.Account.TransactionHis]: undefined;
  [ROUTES.Account.CreditsScreen]: undefined;
  [ROUTES.Account.addReview]: undefined;
  [ROUTES.Account.userGuide]: undefined;
  [ROUTES.Account.userCallHis]: undefined;

  [ROUTES.Account.MyServices]: undefined;
  [ROUTES.Account.ApplyService]: { submissionId: number };
  [ROUTES.Account.MyDiagnosticPack]: undefined;
  [ROUTES.Account.MyBookings]: undefined;
  [ROUTES.Account.WorkshopBookings]: undefined;
  [ROUTES.Account.MyEdp]: undefined;
};

export type AppTabParamList = {
  [ROUTES.App.Home]: undefined;
  [ROUTES.App.Services]: NavigatorScreenParams<ServicesStackParamList>;
  [ROUTES.App.Edp]: NavigatorScreenParams<EdpStackParamList>;
  [ROUTES.App.Account]: NavigatorScreenParams<AccountStackParamList>;
};

export type RootStackParamList = {
  [ROUTES.Root.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.Root.App]: NavigatorScreenParams<AppTabParamList>;
  [ROUTES.Root.ConsultantsList]: undefined;
  [ROUTES.Root.ConsultantDetail]: { slug: string };
  [ROUTES.Root.Wallet]: undefined;
  [ROUTES.Root.WalletTransactions]: undefined;
  [ROUTES.Root.WorkshopsList]: undefined;
  [ROUTES.Root.WorkshopsDetail]: { slug: string };
  [ROUTES.Root.ConsultationOnboarding]: {
    consultantId?: number;
    consultantSlug?: string;
    consultantName?: string;
    consultationType?: 'video' | 'phone';
    callType?: string;
    price?: number;
  };
  [ROUTES.Root.IncomingCall]: { sessionId: number };
  [ROUTES.Root.OutgoingCall]: { sessionId: number };
  [ROUTES.Root.InCall]: { sessionId: number };
  [ROUTES.Root.Search]: SearchScreenParams | undefined;
  [ROUTES.Root.BizAI]: undefined;
  [ROUTES.Root.BusinessDiagnosis]: undefined;
};
