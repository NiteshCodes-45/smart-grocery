import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';

import { AnalyticsKpiCards } from '@/components/AnalyticsKpiCards/AnalyticsKpiCards';
import { AreaTrendChart } from '@/components/Charts/AreaTrendChart';
import { FeatureUsageBarChart } from '@/components/Charts/FeatureUsageBarChart';
import { Loading } from '@/components/Loading/Loading';
import { fetchAnalytics } from '@/features/analytics/analyticsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { analyticsDateRanges } from '@/services/analyticsService';

const rangeOptions = [
  ['Today', analyticsDateRanges.today],
  ['Last 7 days', analyticsDateRanges.last7Days],
  ['Last 30 days', analyticsDateRanges.last30Days],
  ['This month', analyticsDateRanges.thisMonth],
];

export function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const {
    activeUsers, daily, error, eventCount, featureUsage, monthly, newUsers, range, shoppingActivity, status,
  } = useAppSelector((state) => state.analytics);
  const [customStartDate, setCustomStartDate] = useState(range.startDate);
  const [customEndDate, setCustomEndDate] = useState(range.endDate);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, status]);

  const hasData = eventCount > 0;
  const loadRange = (nextRange) => {
    setCustomStartDate(nextRange.startDate);
    setCustomEndDate(nextRange.endDate);
    dispatch(fetchAnalytics(nextRange));
  };

  const loadCustomRange = () => {
    dispatch(fetchAnalytics({ endDate: customEndDate, label: 'Custom range', startDate: customStartDate }));
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Analytics</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Product analytics from approved Firestore events. Dates and activity buckets use UTC.
        </Typography>
      </Box>
      <Stack alignItems={{ md: 'center' }} direction={{ xs: 'column', md: 'row' }} flexWrap="wrap" gap={1}>
        {rangeOptions.map(([label, createRange]) => (
          <Button key={label} onClick={() => loadRange(createRange())} size="small" variant={range.label === label ? 'contained' : 'outlined'}>
            {label}
          </Button>
        ))}
        <TextField label="Start" onChange={(event) => setCustomStartDate(event.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} type="date" value={customStartDate} />
        <TextField label="End" onChange={(event) => setCustomEndDate(event.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} type="date" value={customEndDate} />
        <Button disabled={status === 'loading'} onClick={loadCustomRange} size="small" variant={range.label === 'Custom range' ? 'contained' : 'outlined'}>
          Apply custom range
        </Button>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {status === 'loading' ? <Loading label="Loading analytics" /> : null}
      {status === 'succeeded' && !hasData ? (
        <Alert severity="info">No tracked product events were found for this date range.</Alert>
      ) : null}

      {hasData ? (
        <>
          <AnalyticsKpiCards
            activeUsers={activeUsers}
            eventCount={eventCount}
            newUsers={newUsers}
            rangeLabel={range.label}
          />

          <Box display="grid" gap={2} gridTemplateColumns={{ md: 'repeat(2, minmax(0, 1fr))' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Daily Active Users</Typography>
                <Typography color="text.secondary" mb={1} variant="body2">
                  Unique active users by day.
                </Typography>
                <AreaTrendChart data={daily} dataKey="activeUsers" xAxisKey="date" />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">Monthly Active Users</Typography>
                <Typography color="text.secondary" mb={1} variant="body2">
                  Unique active users by UTC month in the selected range.
                </Typography>
                <AreaTrendChart data={monthly} dataKey="activeUsers" xAxisKey="date" />
              </CardContent>
            </Card>
          </Box>

          <Box display="grid" gap={2} gridTemplateColumns={{ md: 'repeat(2, minmax(0, 1fr))' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Feature Usage</Typography>
                <Typography color="text.secondary" mb={1} variant="body2">
                  Approved event volume in the selected range.
                </Typography>
                <FeatureUsageBarChart data={featureUsage} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">User Growth</Typography>
                <Typography color="text.secondary" mb={1} variant="body2">
                  New registrations by day.
                </Typography>
                <AreaTrendChart data={daily} dataKey="newUsers" xAxisKey="date" color="#f59e0b" gradientColor="#ef4444" />
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6">Shopping Activity</Typography>
              <Typography color="text.secondary" mb={1} variant="body2">
                {shoppingActivity.sessionsStarted} sessions started, {shoppingActivity.sessionsCompleted} completed, {shoppingActivity.groceriesCreated} groceries created, {shoppingActivity.groceriesChecked} items checked, and {shoppingActivity.completedItemCount} completed-session items.
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
