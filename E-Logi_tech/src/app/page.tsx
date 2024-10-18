'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { useUser } from '../hooks/use-user';
import { paths } from '../paths';

export default function Page(): null {
  const { user } = useUser(); // Get the user object

  useEffect(() => {
    if (!user) {
      redirect(paths.auth.signIn); // Redirect if not logged in
    } else if (user.role === 'admin') {
      redirect(paths.admin.overview); // Redirect admins
    } else if (user.role === 'driver') {
      redirect(paths.driver.jobs); // Redirect drivers
    } else {
      redirect(paths.user.bookings); // Redirect regular users
    }
  }, [user]);

  return null; // While redirecting, return null
}
