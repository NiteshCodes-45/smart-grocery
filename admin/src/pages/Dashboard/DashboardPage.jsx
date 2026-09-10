import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Activity, Grid2X2, Smartphone, Users } from 'lucide-react';
import { useEffect } from 'react';

import { AreaTrendChart } from '@/components/Charts/AreaTrendChart';
import { FeatureUsageBarChart } from '@/components/Charts/FeatureUsageBarChart';
import { StatsCard } from '@/components/StatsCard/StatsCard';
import { fetchAnalytics } from '@/features/analytics/analyticsSlice';
import { useAppSelector } from '@/hooks/redux';
import { useAppDispatch } from '@/hooks/redux';
import { analyticsDateRanges } from '@/services/analyticsService';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const totalUsers = useAppSelector((state) => state.users.users.length);
  const totalCategories = useAppSelector((state) => state.categories.categories.length);
  const userError = useAppSelector((state) => state.users.error);
  const categoryError = useAppSelector((state) => state.categories.error);
  const { activeUsers, daily, error: analyticsError, featureUsage, range, shoppingActivity, status } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    if (status === 'idle' || (status === 'succeeded' && range.label !== 'Last 7 days')) {
      dispatch(fetchAnalytics(analyticsDateRanges.last7Days()));
    }
  }, [dispatch, range.label, status]);

  const sessionChartData = daily.map((metric) => ({ date: metric.date, sessions: metric.featureUsage.session_started ?? 0 }));
  const sessionsStarted = shoppingActivity?.sessionsStarted ?? 0;
  const sessionsCompleted = shoppingActivity?.sessionsCompleted ?? 0;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Dashboard</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Operational overview for Smart Grocery.
        </Typography>
      </Box>

      {userError || categoryError || analyticsError ? (
        <Alert severity="error">{userError ?? categoryError ?? analyticsError}</Alert>
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
        <StatsCard caption="Live Firestore users" icon={Users} title="Total Users" value={totalUsers} />
        <StatsCard
          caption="Live Firestore categories"
          icon={Grid2X2}
          title="Total Categories"
          value={totalCategories}
        />
        <StatsCard caption="Unique users in the last 7 days" icon={Activity} title="Active Users" value={activeUsers} />
        <StatsCard caption="Started in the last 7 days" icon={Smartphone} title="Shopping Sessions" value={sessionsStarted} />
      </Box>

      <Box display="grid" gap={2} gridTemplateColumns={{ md: 'repeat(2, minmax(0, 1fr))' }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Weekly Shopping Sessions</Typography>
                <Typography color="text.secondary" variant="body2">
                  Started sessions by UTC day. {sessionsCompleted} completed in this period.
                </Typography>
              </Box>
              <AreaTrendChart data={sessionChartData} dataKey="sessions" xAxisKey="date" />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Top Product Activity</Typography>
                <Typography color="text.secondary" variant="body2">
                  Most-used product features in the last 7 days.
                </Typography>
              </Box>
              <FeatureUsageBarChart data={featureUsage.slice(0, 6)} />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Stack alignItems={{ sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h6">Live product data</Typography>
              <Typography color="text.secondary" variant="body2">
                Analytics refreshes on demand from approved Firestore events; no placeholder data is used.
              </Typography>
            </Box>
            <Button disabled={status === 'loading'} onClick={() => dispatch(fetchAnalytics(analyticsDateRanges.last7Days()))} variant="outlined">
              Refresh analytics
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
