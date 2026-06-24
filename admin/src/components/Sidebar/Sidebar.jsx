import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Grid2X2, LayoutDashboard, Settings, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { APP_NAME, SIDEBAR_ITEMS } from '@/constants/app';
import { EXPANDED_SIDEBAR_WIDTH, getSidebarWidth } from '@/constants/layout';

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  categories: Grid2X2,
  settings: Settings,
};

export function Sidebar({ collapsed, mobileOpen, isMobile, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const drawerWidth = isMobile ? EXPANDED_SIDEBAR_WIDTH : getSidebarWidth(collapsed);

  const content = (
    <Box height="100%" overflow="hidden">
      <Toolbar sx={{ minHeight: 68 }}>
        <Box minWidth={0}>
          <Typography noWrap variant="subtitle1">
            {APP_NAME}
          </Typography>
          {!collapsed || isMobile ? (
            <Typography color="text.secondary" noWrap variant="caption">
              Admin Console
            </Typography>
          ) : null}
        </Box>
      </Toolbar>
      <List sx={{ px: 1.25 }}>
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName];
          const selected = location.pathname === item.path;

          return (
            <Tooltip key={item.path} disableHoverListener={!collapsed || isMobile} placement="right" title={item.label}>
              <ListItemButton
                aria-label={item.label}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    onClose();
                  }
                }}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  minHeight: 48,
                  px: collapsed && !isMobile ? 1.5 : 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? 'primary.main' : 'text.secondary',
                    justifyContent: 'center',
                    minWidth: collapsed && !isMobile ? 44 : 40,
                  }}
                >
                  <Icon size={21} />
                </ListItemIcon>
                {collapsed && !isMobile ? null : <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" flexShrink={0} width={{ md: drawerWidth }}>
      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={onClose}
        open={mobileOpen}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            bgcolor: 'background.paper',
            borderColor: 'divider',
            boxSizing: 'border-box',
            width: EXPANDED_SIDEBAR_WIDTH,
          },
        }}
        variant="temporary"
      >
        {content}
      </Drawer>

      <Drawer
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            bgcolor: 'background.paper',
            borderColor: 'divider',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.sharp,
              }),
            width: drawerWidth,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    </Box>
  );
}
