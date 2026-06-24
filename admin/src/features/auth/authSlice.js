import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  status: 'loading',
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.initialized = true;
      state.error = null;
    },
    setAuthError(state, action) {
      state.admin = null;
      state.status = 'error';
      state.initialized = true;
      state.error = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
      state.status = 'unauthenticated';
      state.initialized = true;
      state.error = null;
    },
  },
});

export const { clearAdmin, setAdmin, setAuthError, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
