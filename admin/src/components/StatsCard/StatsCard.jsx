import { Card, CardContent, Stack, Typography } from '@mui/material';
import { createElement } from 'react';

export function StatsCard({ title, value, caption, icon: Icon }) {
  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
            <Typography color="text.secondary" variant="caption">
              {caption}
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            bgcolor="rgba(56, 189, 248, 0.12)"
            borderRadius={2}
            color="primary.main"
            height={44}
            justifyContent="center"
            minWidth={44}
          >
            {createElement(Icon, { size: 22 })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
