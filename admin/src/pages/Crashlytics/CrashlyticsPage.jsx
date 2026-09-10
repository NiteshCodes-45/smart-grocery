import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  Activity,
  Bug,
  ExternalLink,
  Layers,
  MonitorSmartphone,
  ShieldCheck,
} from 'lucide-react';

import { firebaseConfig } from '@/config/env';

const crashlyticsMetrics = [
  {
    description: 'Release health metric maintained by Firebase Crashlytics.',
    icon: ShieldCheck,
    label: 'Crash-free users',
  },
  {
    description: 'Recent fatal and non-fatal mobile issues grouped by Firebase.',
    icon: Bug,
    label: 'Latest crashes',
  },
  {
    description: 'Device models, OS versions, and affected platforms from real reports.',
    icon: MonitorSmartphone,
    label: 'Affected devices',
  },
  {
    description: 'Crash groups segmented by mobile app release.',
    icon: Layers,
    label: 'App version',
  },
  {
    description: 'Grouped stack traces and occurrence counts from Crashlytics.',
    icon: Activity,
    label: 'Stack trace and frequency',
  },
];

export function CrashlyticsPage() {
  const projectId = firebaseConfig.projectId;
  const crashlyticsUrl = `https://console.firebase.google.com/project/${projectId}/crashlytics`;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Crashlytics</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Mobile crash reporting for the Firebase project connected to this admin environment.
        </Typography>
      </Box>

      <Alert severity="info">
        Firebase Crashlytics data is not stored in Firestore and should not be queried directly from the browser admin.
        Use the Firebase Console for live crash-free users, latest crashes, affected devices, app versions, stack traces,
        and frequency until a trusted reporting backend is approved.
      </Alert>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack alignItems={{ sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h6">Firebase Crashlytics Console</Typography>
                <Typography color="text.secondary" variant="body2">
                  Project: <Chip label={projectId} size="small" sx={{ ml: 0.5 }} />
                </Typography>
              </Box>
              <Button
                component={Link}
                href={crashlyticsUrl}
                rel="noopener noreferrer"
                startIcon={<ExternalLink size={18} />}
                target="_blank"
                underline="none"
                variant="contained"
              >
                Open Crashlytics
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box display="grid" gap={2} gridTemplateColumns={{ md: 'repeat(2, minmax(0, 1fr))' }}>
        {crashlyticsMetrics.map((metric) => {
          const MetricIcon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Box color="primary.main" flexShrink={0} pt={0.25}>
                    <MetricIcon size={22} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{metric.label}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {metric.description}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Stack>
  );
}
