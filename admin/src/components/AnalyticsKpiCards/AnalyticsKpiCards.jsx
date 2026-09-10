import { Box } from '@mui/material';
import { Activity, CalendarDays, UserPlus, UsersRound } from 'lucide-react';

import { StatsCard } from '@/components/StatsCard/StatsCard';

export function AnalyticsKpiCards({ activeUsers, eventCount, newUsers, rangeLabel }) {
  return (
    <Box
      display="grid"
      gap={2}
      gridTemplateColumns={{
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(4, minmax(0, 1fr))',
      }}
    >
      <StatsCard
        caption={`Unique users in ${rangeLabel.toLowerCase()}`}
        icon={Activity}
        title="Active Users"
        value={activeUsers}
      />
      <StatsCard
        caption="Monthly chart is below"
        icon={CalendarDays}
        title="Activity Period"
        value={rangeLabel}
      />
      <StatsCard
        caption="Tracked event volume in selected range"
        icon={UsersRound}
        title="Event Count"
        value={eventCount}
      />
      <StatsCard
        caption="Registration events in selected range"
        icon={UserPlus}
        title="New Users"
        value={newUsers}
      />
    </Box>
  );
}
