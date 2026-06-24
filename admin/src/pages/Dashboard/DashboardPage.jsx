import { Alert, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Grid2X2, PackageCheck, Smartphone, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { INITIAL_DASHBOARD_STATS, SESSION_CHART_DATA } from '@/constants/app';
import { StatsCard } from '@/components/StatsCard/StatsCard';
import { useAppSelector } from '@/hooks/redux';

export function DashboardPage() {
  const totalUsers = useAppSelector((state) => state.users.users.length);
  const totalCategories = useAppSelector((state) => state.categories.categories.length);
  const userError = useAppSelector((state) => state.users.error);
  const categoryError = useAppSelector((state) => state.categories.error);

  const stats = {
    ...INITIAL_DASHBOARD_STATS,
    totalUsers,
    totalCategories,
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Dashboard</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Operational overview for Smart Grocery.
        </Typography>
      </Box>

      {userError || categoryError ? (
        <Alert severity="error">{userError ?? categoryError}</Alert>
      ) : null}

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        <StatsCard caption="Live Firestore users" icon={Users} title="Total Users" value={stats.totalUsers} />
        <StatsCard
          caption="Live Firestore categories"
          icon={Grid2X2}
          title="Total Categories"
          value={stats.totalCategories}
        />
        <StatsCard caption="Analytics not connected yet" icon={Smartphone} title="Today's Sessions" value={stats.todaysSessions} />
        <StatsCard caption="Current mobile release" icon={PackageCheck} title="App Version" value={stats.appVersion} />
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Weekly Sessions</Typography>
              <Typography color="text.secondary" variant="body2">
                Placeholder engagement trend until analytics is added.
              </Typography>
            </Box>
            <Box height={320}>
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart data={SESSION_CHART_DATA} margin={{ bottom: 0, left: 0, right: 12, top: 16 }}>
                  <defs>
                    <linearGradient id="sessionGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                  <XAxis axisLine={false} dataKey="day" tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(148, 163, 184, 0.24)',
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    dataKey="sessions"
                    fill="url(#sessionGradient)"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
