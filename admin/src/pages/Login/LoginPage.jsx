import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { APP_NAME } from '@/constants/app';
import { setAdmin, setAuthError, setAuthLoading } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authService } from '@/services/authService';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, error, initialized, status } = useAppSelector((state) => state.auth);
  const [submitError, setSubmitError] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setSubmitError(error);
  }, [error]);

  if (initialized && admin) {
    return <Navigate replace to="/dashboard" />;
  }

  const onSubmit = async (values) => {
    setSubmitError(null);
    dispatch(setAuthLoading());

    try {
      const signedInAdmin = await authService.signIn(values.email, values.password);
      dispatch(setAdmin(signedInAdmin));

      const state = location.state;
      navigate(state?.from?.pathname ?? '/dashboard', { replace: true });
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Unable to sign in.';
      dispatch(setAuthError(message));
      setSubmitError(message);
    }
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      py={4}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack alignItems="center" spacing={2.5}>
            <Stack
              alignItems="center"
              bgcolor="rgba(52, 211, 153, 0.12)"
              borderRadius={2}
              color="secondary.main"
              height={56}
              justifyContent="center"
              width={56}
            >
              <LockKeyhole size={28} />
            </Stack>
            <Box textAlign="center">
              <Typography gutterBottom variant="h5">
                {APP_NAME}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Sign in with an authorized admin account.
              </Typography>
            </Box>
          </Stack>

          <Box component="form" mt={4} noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.25}>
              {submitError ? <Alert severity="error">{submitError}</Alert> : null}
              <TextField
                autoComplete="email"
                disabled={isSubmitting || status === 'loading'}
                error={Boolean(errors.email)}
                fullWidth
                helperText={errors.email?.message}
                label="Email"
                type="email"
                {...register('email')}
              />
              <TextField
                autoComplete="current-password"
                disabled={isSubmitting || status === 'loading'}
                error={Boolean(errors.password)}
                fullWidth
                helperText={errors.password?.message}
                label="Password"
                type="password"
                {...register('password')}
              />
              <Button
                disabled={isSubmitting || status === 'loading'}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
