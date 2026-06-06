import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    session: null,
    profile: null,
    loading: true,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.loading = false;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.profile = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSession, setProfile, clearAuth, setLoading } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectSession = (state) => state.auth.session;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsAdmin = (state) => state.auth.profile?.role === 'admin';

export default authSlice.reducer;
