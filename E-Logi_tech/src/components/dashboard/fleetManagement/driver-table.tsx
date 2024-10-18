'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

function noop(): void {}

const statusMap = {
  available: { label: 'Available', color: 'success' },
  onTrip: { label: 'On Trip', color: 'info' },
  maintenance: { label: 'In Maintenance', color: 'warning' },
  offline: { label: 'Offline', color: 'error' },
} as const;

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  currentLocation: { lat: number; lng: number };
  status: 'available' | 'onTrip' | 'maintenance' | 'offline';
  lastTrip: Date;
  licenseExpiry: Date;
}

interface FleetManagementProps {
  count?: number;
  rows?: Driver[];
  page?: number;
  rowsPerPage?: number;
}

export function FleetManagement({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: FleetManagementProps): React.JSX.Element {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDriver(null);
  };

  const handleTrackDriver = (driver: Driver) => {
    setOpen(false);
    const query = new URLSearchParams({
      driverId: driver.id,
      lat: driver.currentLocation.lat.toString(),
      lng: driver.currentLocation.lng.toString(),
    }).toString();
    router.push(`/admin/driver-tracking?${query}`);
  };

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Trip</TableCell>
                <TableCell>License Expiry</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const { label, color } = statusMap[row.status];
                return (
                  <TableRow hover key={row.id} onClick={() => handleOpen(row)} style={{ cursor: 'pointer' }}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.vehicle}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" />
                    </TableCell>
                    <TableCell>{dayjs(row.lastTrip).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{dayjs(row.licenseExpiry).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleTrackDriver(row)}
                        disabled={row.status === 'offline'}
                      >
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={noop}
          onRowsPerPageChange={noop}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {selectedDriver && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              maxWidth: 500,
              mx: 'auto',
              mt: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Driver Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>ID: {selectedDriver.id}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Name: {selectedDriver.name}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Phone: {selectedDriver.phone}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Vehicle: {selectedDriver.vehicle}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              License Expiry: {dayjs(selectedDriver.licenseExpiry).format('MMM D, YYYY')}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Last Trip: {dayjs(selectedDriver.lastTrip).format('MMM D, YYYY')}
            </Typography>
            {/* <CardActionArea sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}> */}
              {selectedDriver.status !== 'offline' && (
                <Button onClick={() => handleTrackDriver(selectedDriver)} size="small" variant="outlined">
                  Track
                </Button>
              )}
              <Button onClick={handleClose} size="small" variant="outlined" color="error">
                Close
              </Button>
            {/* </CardActionArea> */}
          </Box>
        </Modal>
      )}
    </>
  );
}

export default FleetManagement;
