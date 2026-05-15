import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, LoginSession, User } from './authTypes';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loginSession: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    setLoginSession: (state, action: PayloadAction<LoginSession>) => {
      state.loginSession = action.payload;
    },

    clearLoginSession: (state) => {
      state.loginSession = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginSession = null;
    },
  },
});

export const { setCredentials, setLoginSession, clearLoginSession, logout } = authSlice.actions;
