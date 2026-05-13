export const ROUTES = {
  Root: {
    Auth: 'Root/Auth',
    App: 'Root/App',
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
  },
  Services: {
    List: 'App/Services/List',
    Detail: 'App/Services/Detail',
  },
} as const;

