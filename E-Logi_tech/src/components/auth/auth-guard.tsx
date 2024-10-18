'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const checkPermissions = () => {
      if (!isLoading) {
        const storedUser = localStorage.getItem('user');
        if (!user && !storedUser) {
          router.replace(paths.auth.signIn);
        } else if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          switch (parsedUser.role) {
            case 'admin':
              router.replace(paths.admin.overview);
              break;
            case 'driver':
              router.replace(paths.driver.jobs);
              break;
            case 'user':
              router.replace(paths.user.bookings);
              break;
            default:
              router.replace(paths.auth.signIn);
              break;
          }
        }
      }
    };

    checkPermissions();
  }, [user, isLoading, router]);

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <>{children}</>;
}
