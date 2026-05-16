export const ROUTES = {
  Root: {
    Auth: 'Root/Auth',
    App: 'Root/App',
    /** Full-screen stack above tabs (not a tab bar destination). */
    ConsultantsList: 'Root/ConsultantsList',
    ConsultantDetail: 'Root/ConsultantDetail',
    Wallet: 'Root/Wallet',
    WorkshopsList: 'Root/WorkshopsList',
  },
  Auth: {
    Splash: 'Auth/Splash',
    Landing: 'Auth/Landing',
    ChooseAccountType: 'Auth/ChooseAccountType',
    Login: 'Auth/Login',
    Signup: 'Auth/Signup',
    OtpVerification: 'Auth/OtpVerification',
    ProfileSetup: 'Auth/ProfileSetup',
  },
  App: {
    Home: 'App/Home',
    Services: 'App/Services',
    Edp: 'App/Edp',
    Account: 'App/Account',
  },
  Edp: {
    Main: 'Edp/Main',
    Modules: 'Edp/Modules',
    ModuleDetail: 'Edp/ModuleDetail',
  },
  Services: {
    List: 'App/Services/List',
    Detail: 'App/Services/Detail',
    Onboarding: 'App/Services/Onboarding',
  },
  Account: {
    Home: 'App/Account/Home',
    HelpSettings: 'App/Account/HelpSettings',
    Membership: 'App/Account/MembershipScreen',
  },
} as const;

