'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    // If user is logged in, redirect based on role
    if (user) {
      const { role } = user;

      logger.debug('[GuestGuard]: User is logged in, redirecting based on role');

      if (role === 'admin') {
        router.replace(paths.admin.overview);
      } else if (role === 'driver') {
        router.replace(paths.driver.jobs);
      } else if (role === 'user') {
        router.replace(paths.user.bookings);
      } else {
        logger.debug('[GuestGuard]: Unrecognized role, redirecting to sign in');
        router.replace(paths.auth.signIn);
      }

      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
