'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, Select, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const { user, setUser } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setError('root', { type: 'manual', message: '' });

      try {
        const response = await fetch('/api/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError('root', {
            type: 'server',
            message: result.error || 'Sign-in failed. Please try again.',
          });
          setIsPending(false);
          return;
        }
        const userData = {
          id: result._id,
          name: result.name,
          email: result.email,
          phone: result.phone,
          address: result.address,
          role: result.role,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        };

        // Set user in context
        setUser(userData);

        // Persist the user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // Redirect based on role
        if (result.role === 'admin') {
          router.replace(paths.admin.overview);
        } else if (result.role === 'driver') {
          router.replace(paths.driver.jobs);
        } else if (result.role === 'user') {
          router.replace(paths.user.bookings);
        }

        router.refresh(); // Refresh the session or result if needed
      } catch (error) {
        setError('root', {
          type: 'server',
          message: 'An unexpected error occurred. Please try again later.',
        });
      } finally {
        setIsPending(false); // Reset loading state
      }
    },
    [router, setError, setUser] // Removed `user` from dependencies as it is unnecessary
  );

  return (
    <Card sx={{ padding: 10 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign in</Typography>
          <Typography color="text.secondary" variant="body2">
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
              Sign up
            </Link>
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <div>
              <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
                Forgot password?
              </Link>
            </div>
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Sign in
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
