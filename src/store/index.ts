import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import MMKVStorage from 'react-native-mmkv-storage';

import { authSlice } from '@/features/Auth/store/authSlice';
import type { AuthState } from '@/features/Auth/store/authTypes';
import { baseApi } from '@/services/api/baseApi';
import '@/features/Auth/api/authApi';
import '@/features/consultant/api/consultantApi';

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
