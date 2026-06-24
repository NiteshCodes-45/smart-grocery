import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header/Header';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { getSidebarWidth } from '@/constants/layout';
import { fetchCategories } from '@/features/categories/categorySlice';
import { fetchUsers } from '@/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { theme } from '@/theme/theme';

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const admin = useAppSelector((state) => state.auth.admin);
  const categoryStatus = useAppSelector((state) => state.categories.status);
  const userStatus = useAppSelector((state) => state.users.status);

  const sidebarWidth = useMemo(() => getSidebarWidth(collapsed), [collapsed]);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }

    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch, userStatus]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileOpen((current) => !current);
      return;
    }

    setCollapsed((current) => !current);
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Header
        admin={admin}
        collapsed={collapsed}
        isMobile={isMobile}
        onSidebarToggle={handleSidebarToggle}
      />
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          minWidth: 0,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${sidebarWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: 68 }} />
        <Outlet />
      </Box>
    </Box>
  );
}
