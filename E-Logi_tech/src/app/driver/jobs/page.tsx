import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { JobsTable, Jobs as jobsTypes } from '@/components/driver/jobs-table';

// export const metadata = { title: `Bookings | Status | ${config.site.name}` } satisfies Metadata;

const bookings = [
  {
    id: '1',
    serviceName: 'Parcel Delivery',
    pickupAddress: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      street: '123 5th Ave',
      lat: 40.712776,
      lng: -74.005974,
    },
    currentLocation: {
      lat: 40.73061,
      lng: -73.935242,
    },
    dropAddress: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      street: '456 Hollywood Blvd',
      lat: 34.052235,
      lng: -118.243683,
    },
    phone: '555-1234',
    date: new Date('2024-10-12T10:00:00Z'),
    status: 'enroute to pickup',
    approval: 'approved',
  },
  {
    id: '2',
    serviceName: 'Food Delivery',
    pickupAddress: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      street: '789 Market St',
      lat: 37.774929,
      lng: -122.419418,
    },
    currentLocation: {
      lat: 37.779026,
      lng: -122.419906,
    },
    dropAddress: {
      city: 'San Diego',
      state: 'CA',
      country: 'USA',
      street: '123 Ocean Blvd',
      lat: 32.715736,
      lng: -117.161087,
    },
    phone: '555-5678',
    date: new Date('2024-10-13T14:00:00Z'),
    status: 'delivered',
    approval: 'approved',
  },
  {
    id: '3',
    serviceName: 'Furniture Moving',
    pickupAddress: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      street: '1010 W Randolph St',
      lat: 41.878113,
      lng: -87.629799,
    },
    currentLocation: {
      lat: 41.878114,
      lng: -87.629798,
    },
    dropAddress: {
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      street: '202 Elm St',
      lat: 32.776665,
      lng: -96.796989,
    },
    phone: '555-9101',
    date: new Date('2024-10-14T09:30:00Z'),
    status: 'enroute to drop',
    approval: 'not approved',
  },
] satisfies jobsTypes[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedBookings = applyPagination(bookings, page, rowsPerPage);

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Jobs</Typography>
          </Stack>
        </Stack>
        <JobsTable count={paginatedBookings.length} page={page} rows={paginatedBookings} rowsPerPage={rowsPerPage} />
      </Stack>
    </>
  );
}

function applyPagination(rows: jobsTypes[], page: number, rowsPerPage: number): jobsTypes[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
