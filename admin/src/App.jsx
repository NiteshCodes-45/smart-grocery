import { useEffect } from 'react';

import { AppRoutes } from '@/routes/AppRoutes';
import { setAdmin, setAuthError, setAuthLoading } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/redux';
import { authService } from '@/services/authService';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading());

    const unsubscribe = authService.observeAdmin(
      (admin) => {
        dispatch(setAdmin(admin));
      },
      (message) => {
        dispatch(setAuthError(message));
      },
    );

    return unsubscribe;
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
