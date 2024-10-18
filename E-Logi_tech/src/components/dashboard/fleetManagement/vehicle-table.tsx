'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Modal,
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
  inTransit: { label: 'In Transit', color: 'info' },
  maintenance: { label: 'In Maintenance', color: 'warning' },
} as const;

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: string;
  status: 'available' | 'inTransit' | 'maintenance';
  driverId: string;
  createdAt: Date;
}

interface VehicleManagementProps {
  count?: number;
  rows?: Vehicle[];
  page?: number;
  rowsPerPage?: number;
}

export function VehicleManagement({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: VehicleManagementProps): React.JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Driver ID</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const { label, color } = statusMap[row.status];
                return (
                  <TableRow hover key={row.id} onClick={() => handleOpen(row)} style={{ cursor: 'pointer' }}>
                    <TableCell>{row.vehicleNumber}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.capacity}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" />
                    </TableCell>
                    <TableCell>{row.driverId}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleOpen(row)}>
                        Details
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

      {selectedVehicle && (
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
              Vehicle Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Vehicle Number: {selectedVehicle.vehicleNumber}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Type: {selectedVehicle.type}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Capacity: {selectedVehicle.capacity}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Driver ID: {selectedVehicle.driverId}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Created At: {dayjs(selectedVehicle.createdAt).format('MMM D, YYYY')}
            </Typography>
            <Button onClick={handleClose} size="small" variant="outlined" color="error">
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default VehicleManagement;
