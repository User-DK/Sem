import React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Driver as driversTypes, FleetManagement } from '@/components/dashboard/fleetManagement/driver-table';
import { VehicleManagement, Vehicle as vehicleTypes } from '@/components/dashboard/fleetManagement/vehicle-table';

// export const metadata = { title: `Bookings | Status | ${config.site.name}` } satisfies Metadata;

const drivers: driversTypes[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '555-1234',
    vehicle: 'Toyota Corolla',
    currentLocation: { lat: 40.73061, lng: -73.935242 },
    status: 'available',
    lastTrip: new Date('2024-10-12T10:00:00Z'),
    licenseExpiry: new Date('2024-10-12T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Jane Doe',
    phone: '555-1234',
    vehicle: 'Honda Civic',
    currentLocation: { lat: 37.779026, lng: -122.419906 },
    status: 'onTrip',
    lastTrip: new Date('2024-10-12T10:00:00Z'),
    licenseExpiry: new Date('2024-10-12T10:00:00Z'),
  },
];

const vehicles: vehicleTypes[] = [
  {
    id: '1',
    vehicleNumber: 'ABC123',
    type: 'Toyota Corolla',
    capacity: '4',
    status: 'available',
    driverId: '1',
    createdAt: new Date('2024-10-12T10:00:00Z'),
  },
  {
    id: '2',
    vehicleNumber: 'XYZ123',
    type: 'Honda Civic',
    capacity: '4',
    status: 'maintenance',
    driverId: '2',
    createdAt: new Date('2024-10-12T10:00:00Z'),
  },
];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const paginatedDrivers = applyPagination<driversTypes>(drivers, page, rowsPerPage);
  const paginatedVehicles = applyPagination<vehicleTypes>(vehicles, page, rowsPerPage);

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Drivers Fleet</Typography>
            </Stack>
          </Stack>
          <FleetManagement
            count={paginatedDrivers.length}
            page={page}
            rows={paginatedDrivers}
            rowsPerPage={rowsPerPage}
          />
        </Stack>
        <Divider aria-hidden="true" />
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Vehicles Fleet</Typography>
            </Stack>
          </Stack>
          <VehicleManagement
            count={paginatedVehicles.length}
            page={page}
            rows={paginatedVehicles}
            rowsPerPage={rowsPerPage}
          />
        </Stack>
      </Stack>
    </>
  );
}

function applyPagination<T>(rows: T[], page: number, rowsPerPage: number): T[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
