import { lazy, Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Loading } from '@/components/Loading/Loading';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

const DashboardLayout = lazy(() =>
  import('@/layouts/DashboardLayout').then((module) => ({ default: module.DashboardLayout })),
);
const CategoriesPage = lazy(() =>
  import('@/pages/Categories/CategoriesPage').then((module) => ({ default: module.CategoriesPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const LoginPage = lazy(() => import('@/pages/Login/LoginPage').then((module) => ({ default: module.LoginPage })));
const SettingsPage = lazy(() =>
  import('@/pages/Settings/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const UsersPage = lazy(() => import('@/pages/Users/UsersPage').then((module) => ({ default: module.UsersPage })));

export function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<Loading label="Loading admin panel" />}>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<Navigate replace to="/dashboard" />} path="/" />
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<UsersPage />} path="/users" />
            <Route element={<CategoriesPage />} path="/categories" />
            <Route element={<SettingsPage />} path="/settings" />
          </Route>
          <Route element={<Navigate replace to="/dashboard" />} path="*" />
        </Routes>
      </Suspense>
    </Router>
  );
}
