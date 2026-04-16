export const ROUTES = {
  Root: {
    Auth: 'Root/Auth',
    App: 'Root/App',
  },
  Auth: {
    Splash: 'Auth/Splash',
    Landing: 'Auth/Landing',
    Login: 'Auth/Login',
    Signup: 'Auth/Signup',
    OtpVerification: 'Auth/OtpVerification',
    ProfileSetup: 'Auth/ProfileSetup',
  },
  App: {
    Home: 'App/Home',
    Services: 'App/Services',
    Bookings: 'App/Bookings',
    Wallet: 'App/Wallet',
    Account: 'App/Account',
  },
} as const;

