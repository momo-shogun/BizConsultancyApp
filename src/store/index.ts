import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import MMKVStorage from 'react-native-mmkv-storage';

import { authSlice } from '@/features/Auth/store/authSlice';
import type { AuthState } from '@/features/Auth/store/authTypes';
import { callSlice } from '@/features/Calls/store/callSlice';
import { baseApi } from '@/services/api/baseApi';
import '@/features/Auth/api/authApi';
import '@/features/consultant/api/consultantApi';
import '@/features/Services/api/servicesApi';
import '@/features/Services/api/serviceOnboardingApi';
import '@/features/MyServices/api/myServicesApi';
import '@/features/Search/api/searchApi';
import '@/features/Calls/api/callsApi';
import '@/features/Consultation/api/consultantBookingsApi';
import '@/features/Bookings/api/myConsultantBookingsApi';
import '@/features/Bookings/api/consultantSelfBookingsApi';
import '@/features/ConsultantSlotTime/api/consultantScheduleApi';
import '@/features/DocumentVault/api/documentVaultApi';
import '@/features/ConsultantSelf/api/consultantSelfApi';
import '@/features/Edp/api/edpPurchasesApi';
import '@/features/Edp/api/edpLandingApi';
import '@/features/Home/api/workshopsApi';
import '@/features/Home/api/workshopBookingsApi';
import '@/features/Home/api/userWalletsApi';
import '@/features/Wallet/api/walletApi';
import '@/features/Wallet/api/consultantWithdrawalsApi';
import '@/features/Wallet/api/consultantWalletTransactionsApi';
import '@/features/Home/api/homePublicApi';
import '@/features/Diagnostics/api/diagnosticsApi';
import '@/features/Profile/api/userFeedbackApi';
import '@/features/Profile/api/userProfileApi';
import '@/features/Profile/api/membershipRegistrationApi';
import '@/features/Profile/api/consultantProfileApi';

const MMKV = new MMKVStorage.Loader().initialize();

const authPersistTransform = createTransform<AuthState, AuthState>(
  (state) => ({
    ...state,
    loginSession: null,
  }),
  (state) => state,
  { whitelist: ['auth'] },
);

const persistConfig = {
  key: 'root',
  storage: {
    setItem: (key: string, value: string) => MMKV.setStringAsync(key, value),
    getItem: (key: string) => MMKV.getStringAsync(key),
    removeItem: (key: string) => MMKV.removeItem(key),
  },
  whitelist: ['auth'],
  transforms: [authPersistTransform],
};

const appReducer = combineReducers({
  auth: authSlice.reducer,
  call: callSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof appReducer>;

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
