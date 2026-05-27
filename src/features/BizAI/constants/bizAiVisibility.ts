import { ROUTES } from '@/navigation/routeNames';

/** Tab roots where the floating Biz AI entry may appear. */
export const BIZ_AI_VISIBLE_TAB_ROUTES: readonly string[] = [
  ROUTES.App.Home,
  ROUTES.App.Services,
  ROUTES.App.Edp,
  ROUTES.App.Account,
];

/**
 * Nested routes (per tab) where Biz AI must be hidden — mirrors tab-bar hide rules
 * plus onboarding / deep flows.
 */
export const BIZ_AI_HIDDEN_NESTED_ROUTES: Readonly<Record<string, readonly string[]>> = {
  [ROUTES.App.Services]: [ROUTES.Services.Detail, ROUTES.Services.Onboarding],
  [ROUTES.App.Edp]: [
    ROUTES.Edp.Modules,
    ROUTES.Edp.ModuleDetail,
    ROUTES.Edp.OverviewVideo,
    ROUTES.Edp.AskQuestions,
  ],
  [ROUTES.App.Account]: [
    ROUTES.Account.HelpSettings,
    ROUTES.Account.Membership,
    ROUTES.Account.EditProfile,
    ROUTES.Account.ConsultantBankDetailsScreen,
    ROUTES.Account.ExpertVideosScreen,
    ROUTES.Account.TransactionHis,
    ROUTES.Account.ConsultantWallet,
    ROUTES.Account.ConsultantWithdrawals,
    ROUTES.Account.CreditsScreen,
    ROUTES.Account.addReview,
    ROUTES.Account.userGuide,
    ROUTES.Account.MyServices,
    ROUTES.Account.ApplyService,
    ROUTES.Account.ConsultantBookings,
    ROUTES.Account.ConsultantSlotTime,
    ROUTES.Account.ConsultantMyServices,
    ROUTES.Account.ApplyService,
    ROUTES.Account.ConsultantLockers,
    ROUTES.Account.ConsultantExpertise,
    ROUTES.Account.ConsultantReviews,
  ],
};
