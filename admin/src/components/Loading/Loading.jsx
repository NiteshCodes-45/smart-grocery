import { Box, CircularProgress, Typography } from '@mui/material';

export function Loading({ label = 'Loading' }) {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      gap={2}
      justifyContent="center"
      minHeight="50vh"
    >
      <CircularProgress size={34} thickness={4} />
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}
