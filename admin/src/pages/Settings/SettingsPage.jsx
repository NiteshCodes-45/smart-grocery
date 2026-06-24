import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { INITIAL_SETTINGS } from '@/constants/app';

const settingsSchema = z.object({
  appName: z.string().trim().min(2, 'App name is required.'),
  currentVersion: z.string().trim().min(1, 'Current version is required.'),
  supportEmail: z.string().email('Enter a valid support email.'),
});

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const {
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: settings,
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (values) => {
    // TODO: Persist app settings to Firestore once the settings document path is confirmed.
    setSettings(values);
    setSaved(true);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Settings</Typography>
        <Typography color="text.secondary" mt={0.75} variant="body2">
          Manage public app metadata and support details.
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 720 }}>
        <CardContent>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              {saved ? <Alert severity="success">Settings saved locally.</Alert> : null}
              <TextField
                error={Boolean(errors.appName)}
                fullWidth
                helperText={errors.appName?.message}
                label="App Name"
                {...register('appName')}
              />
              <TextField
                error={Boolean(errors.currentVersion)}
                fullWidth
                helperText={errors.currentVersion?.message}
                label="Current Version"
                {...register('currentVersion')}
              />
              <TextField
                error={Boolean(errors.supportEmail)}
                fullWidth
                helperText={errors.supportEmail?.message}
                label="Support Email"
                type="email"
                {...register('supportEmail')}
              />
              <Box>
                <Button
                  disabled={!isDirty || isSubmitting}
                  startIcon={<Save size={18} />}
                  type="submit"
                  variant="contained"
                >
                  Save Settings
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
