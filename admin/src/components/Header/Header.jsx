import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { APP_NAME } from '@/constants/app';
import { environment } from '@/config/env';
import { authService } from '@/services/authService';

const environmentLabel = {
  development: 'Development',
  staging: 'Staging',
  production: 'Production',
};

const environmentColor = {
  development: 'info',
  staging: 'warning',
  production: 'success',
};

export function Header({ admin, collapsed, isMobile, onSidebarToggle }) {
  const handleSignOut = async () => {
    await authService.signOut();
  };

  const ToggleIcon = isMobile ? Menu : collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="fixed"
      sx={{
        backdropFilter: 'blur(18px)',
        bgcolor: 'rgba(11, 16, 32, 0.84)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 68 }}>
        <Tooltip title={isMobile ? 'Open navigation' : 'Toggle navigation'}>
          <IconButton aria-label="Toggle navigation" color="inherit" edge="start" onClick={onSidebarToggle}>
            <ToggleIcon size={22} />
          </IconButton>
        </Tooltip>

        <Box flexGrow={1} minWidth={0} px={2}>
          <Typography noWrap variant="h6">
            {/* {APP_NAME} */}
          </Typography>
        </Box>

        <Stack alignItems="center" direction="row" spacing={1.25}>
          <Chip
            color={environmentColor[environment] ?? 'default'}
            label={environmentLabel[environment] ?? environment}
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
            variant="outlined"
          />
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', height: 34, width: 34 }}>
            {admin?.email?.charAt(0).toUpperCase() ?? 'A'}
          </Avatar>
          <Box display={{ xs: 'none', sm: 'block' }} maxWidth={260}>
            <Typography noWrap variant="body2">
              {admin?.email ?? 'Admin'}
            </Typography>
            <Typography color="text.secondary" noWrap variant="caption">
              {admin?.role ?? 'Verifying'}
            </Typography>
          </Box>
          <Tooltip title="Sign out">
            <IconButton aria-label="Sign out" color="inherit" onClick={handleSignOut}>
              <LogOut size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
