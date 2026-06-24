import { Component } from 'react';

import { Alert, Box, Button, Typography } from '@mui/material';

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin panel error boundary caught an error', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Box alignItems="center" display="flex" justifyContent="center" minHeight="100vh" p={3}>
        <Box maxWidth={520} width="100%">
          <Typography gutterBottom variant="h5">
            Something went wrong
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {this.state.message || 'The admin panel could not recover from this error.'}
          </Alert>
          <Button onClick={() => window.location.reload()} variant="contained">
            Reload
          </Button>
        </Box>
      </Box>
    );
  }
}
