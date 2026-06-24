import { Navigate, useLocation } from 'react-router-dom';

import { Loading } from '@/components/Loading/Loading';
import { useAppSelector } from '@/hooks/redux';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { admin, initialized, status } = useAppSelector((state) => state.auth);

  if (!initialized || status === 'loading') {
    return <Loading label="Verifying admin access" />;
  }

  if (!admin) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}
