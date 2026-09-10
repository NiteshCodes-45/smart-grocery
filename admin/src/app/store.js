import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import analyticsReducer from '@/features/analytics/analyticsSlice';
import categoryReducer from '@/features/categories/categorySlice';
import userReducer from '@/features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analytics: analyticsReducer,
    users: userReducer,
    categories: categoryReducer,
  },
});
