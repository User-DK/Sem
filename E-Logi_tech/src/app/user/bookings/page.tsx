'use client';

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { BookingConfirmationForm } from '@/components/user/bookings/bookingConfirmationForm';
import type { Bookings as bookingTypes } from '@/components/user/bookings/bookingtable';
import { BookingsTable } from '@/components/user/bookings/bookingtable';

export default function Page(): React.JSX.Element {
  const [bookings, setBookings] = useState<bookingTypes[]>([]);
  const page = 0;
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        console.error('No user found in local storage');
        return;
      }

      const { id: userId } = JSON.parse(storedUser);

      try {
        const response = await fetch(`/api/bookings?userId=${userId}`);
        const bookings = await response.json();
        setBookings(bookings);
        console.log('User bookings:', bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const paginatedBookings = applyPagination(bookings, page, rowsPerPage);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Bookings</Typography>
          </Stack>
          <div>
            <Button
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={handleClickOpen}
            >
              New booking
            </Button>
          </div>
        </Stack>
        <BookingsTable
          count={paginatedBookings.length}
          page={page}
          rows={paginatedBookings}
          rowsPerPage={rowsPerPage}
        />
      </Stack>

      <BookingConfirmationForm open={open} handleClose={handleClose} />
    </>
  );
}

function applyPagination(rows: bookingTypes[], page: number, rowsPerPage: number): bookingTypes[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
