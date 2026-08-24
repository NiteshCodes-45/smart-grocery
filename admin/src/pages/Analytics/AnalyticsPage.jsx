import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export function AnalyticsPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Analytics</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Product and operational insights will appear here when the analytics pipeline is connected.
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6">Analytics infrastructure</Typography>
          <Typography color="text.secondary" mt={1} variant="body2">
            This workspace is reserved for aggregate metrics, freshness indicators, and bounded date-range views.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}