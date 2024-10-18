'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

import 'leaflet/dist/leaflet.css';

function noop(): void {}

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  'enroute to drop': { label: 'Enroute(Drop)', color: 'warning' },
  'enroute to pickup': { label: 'Enroute(Pickup)', color: 'warning' },
  cancelled: { label: 'Cancelled', color: 'error' },
} as const;

const approvalMap = {
  approved: { label: 'Approved', color: 'success' },
  'not approved': { label: 'Not Approved', color: 'warning' },
} as const;

export interface Jobs {
  id: string;
  serviceName: string;
  pickupAddress: { city: string; state: string; country: string; street: string; lat: number; lng: number };
  currentLocation: { lat: number; lng: number };
  dropAddress: { city: string; state: string; country: string; street: string; lat: number; lng: number };
  phone: string;
  date: Date;
  status: 'delivered' | 'enroute to pickup' | 'enroute to drop' | 'pending' | 'cancelled';
  approval: 'approved' | 'not approved';
}

interface JobsTableProps {
  count?: number;
  page?: number;
  rows?: Jobs[];
  rowsPerPage?: number;
}

export function JobsTable({ count = 0, rows = [], page = 0, rowsPerPage = 0 }: JobsTableProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Jobs | null>(null);
  const [trackOpen, setTrackOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const router = useRouter(); // For routing

  const handleOpen = (job: Jobs) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const handleTrackOpen = (job: Jobs) => {
    setSelectedJob(job);
    setOpen(false);
    const query = new URLSearchParams({
      jobId: job.id,
      plat: job.pickupAddress.lat.toString(),
      plng: job.pickupAddress.lng.toString(),
      dlat: job.dropAddress.lat.toString(),
      dlng: job.dropAddress.lng.toString(),
      status: job.status.toString(),
    }).toString();
    router.push(`/driver/route-tracking?${query}`);
  };

  const handleTrackClose = () => {
    setTrackOpen(false);
    setSelectedJob(null);
  };

  const handleApproveChange = (job: Jobs) => {
    if (job.approval === 'not approved') {
      setSelectedJob(job);
      setConfirmApprove(true); // Open confirmation dialog
    }
  };

  const confirmApproval = async () => {
    if (!selectedJob) return;
    try {
      await fetch('/api/approveJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedJob.id, approval: 'approved' }),
      });
      selectedJob.approval = 'approved';
    } catch (error) {
      console.error('Error approving job:', error);
    }
    setConfirmApprove(false);
  };

  useEffect(() => {
    if (selectedJob) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching current location:', error);
        }
      );
    }
  }, [selectedJob]);

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Approve</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Service Name</TableCell>
                <TableCell sortDirection="desc">Date</TableCell>
                <TableCell>Pick Up Address</TableCell>
                <TableCell>Drop Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const { label, color } = statusMap[row.status] ?? { label: 'Unknown', color: 'default' };
                const { label: approvalLabel, color: approvalColor } = approvalMap[row.approval] ?? {
                  label: 'Unknown',
                  color: 'default',
                };
                return (
                  <TableRow hover key={row.id} onClick={() => handleOpen(row)} style={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Checkbox
                        disabled={row.approval === 'approved'}
                        checked={row.approval === 'approved'}
                        onChange={() => handleApproveChange(row)}
                      />
                    </TableCell>
                    <TableCell onClick={() => handleOpen(row)}>{row.id}</TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.serviceName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{dayjs(row.date).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{row.pickupAddress.city},</TableCell>
                    <TableCell>{row.dropAddress.city},</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" />
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

      {selectedJob && selectedJob.approval === 'approved' && (
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
              Job Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>ID: {selectedJob.id}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Service Name: {selectedJob.serviceName}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Phone: {selectedJob.phone}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Pickup Address: {selectedJob.pickupAddress.city}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Drop Address: {selectedJob.dropAddress.city}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Date: {dayjs(selectedJob.date).format('MMM D, YYYY')}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Status: {statusMap[selectedJob.status]?.label ?? 'Unknown'}
            </Typography>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
              {selectedJob.approval === 'approved' &&
                (selectedJob.status === 'pending' ||
                  selectedJob.status === 'enroute to drop' ||
                  selectedJob.status === 'enroute to pickup') && (
                  <Button onClick={() => handleTrackOpen(selectedJob)} size="small" variant="outlined">
                    Get Route
                  </Button>
                )}
              <Button onClick={handleClose} size="small" variant="outlined" color="error">
                Close
              </Button>
            </CardActionArea>
          </Box>
        </Modal>
      )}

      {selectedJob && selectedJob.approval === 'not approved' && (
        <Dialog open={confirmApprove} onClose={() => setConfirmApprove(false)}>
          <DialogTitle>Confirm Approval</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this job? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmApprove(false)} color="error">
              Cancel
            </Button>
            <Button onClick={confirmApproval} color="primary" autoFocus>
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default JobsTable;
