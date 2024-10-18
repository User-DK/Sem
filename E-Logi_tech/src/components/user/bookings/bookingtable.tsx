// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardActionArea,
//   Chip,
//   Divider,
//   Modal,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Typography,
// } from '@mui/material';
// import dayjs from 'dayjs';
// // import { LatLng } from 'leaflet';
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// import 'leaflet/dist/leaflet.css';

// import App from 'next/app';

// function noop(): void {}

// const statusMap = {
//   pending: { label: 'Pending', color: 'warning' },
//   delivered: { label: 'Delivered', color: 'success' },
//   'enroute to drop': { label: 'Enroute(Drop)', color: 'warning' },
//   'enroute to pickup': { label: 'Enroute(Pickup)', color: 'warning' },
//   cancelled: { label: 'Cancelled', color: 'error' },
// } as const;

// const approvalMap = {
//   approved: { label: 'Approved', color: 'success' },
//   'not approved': { label: 'Not Approved', color: 'warning' },
// } as const;

// export interface Bookings {
//   id: string;
//   serviceName: string;
//   pickupAddress: { city: string; state: string; country: string; street: string; lat: number; lng: number };
//   currentLocation: { lat: number; lng: number };
//   dropAddress: { city: string; state: string; country: string; street: string; lat: number; lng: number };
//   phone: string;
//   date: Date;
//   status: 'delivered' | 'enroute to pickup' | 'enroute to drop' | 'pending' | 'cancelled';
//   approval: 'approved' | 'not approved';
// }

// interface BookingsTableProps {
//   count?: number;
//   page?: number;
//   rows?: Bookings[];
//   rowsPerPage?: number;
// }

// export function BookingsTable({
//   count = 0,
//   rows = [],
//   page = 0,
//   rowsPerPage = 0,
// }: BookingsTableProps): React.JSX.Element {
//   const [open, setOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<Bookings | null>(null);
//   const [trackOpen, setTrackOpen] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

//   const handleOpen = (booking: Bookings) => {
//     setSelectedBooking(booking);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedBooking(null);
//   };

//   const handleTrackOpen = (booking: Bookings) => {
//     setSelectedBooking(booking);
//     setOpen(false);
//     setTrackOpen(true);
//   };

//   const handleTrackClose = () => {
//     setTrackOpen(false);
//     setSelectedBooking(null);
//   };

//   useEffect(() => {
//     if (selectedBooking) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error('Error fetching current location:', error);
//         }
//       );
//     }
//   }, [selectedBooking]);

//   return (
//     <>
//       <Card>
//         <Box sx={{ overflowX: 'auto' }}>
//           <Table sx={{ minWidth: '800px' }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Approval</TableCell>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Service Name</TableCell>
//                 <TableCell sortDirection="desc">Date</TableCell>
//                 <TableCell>Pick Up Address</TableCell>
//                 <TableCell>Drop Address</TableCell>
//                 <TableCell>Phone</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row) => {
//                 const { label, color } = statusMap[row.status] ?? { label: 'Unknown', color: 'default' };
//                 const { label: approvalLabel, color: approvalColor } = approvalMap[row.approval] ?? {
//                   label: 'Unknown',
//                   color: 'default',
//                 };
//                 return (
//                   <TableRow hover key={row.id} onClick={() => handleOpen(row)} style={{ cursor: 'pointer' }}>
//                     <TableCell>
//                       <Chip color={approvalColor} label={approvalLabel} size="small" />
//                     </TableCell>
//                     <TableCell>{row.id}</TableCell>
//                     <TableCell>
//                       <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
//                         <Typography variant="subtitle2">{row.serviceName}</Typography>
//                       </Stack>
//                     </TableCell>
//                     <TableCell>{dayjs(row.date).format('MMM D, YYYY')}</TableCell>
//                     <TableCell>{row.pickupAddress.city},</TableCell>
//                     <TableCell>{row.dropAddress.city},</TableCell>
//                     <TableCell>{row.phone}</TableCell>

//                     <TableCell>
//                       <Chip color={color} label={label} size="small" />
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </Box>
//         <Divider />
//         <TablePagination
//           component="div"
//           count={count}
//           onPageChange={noop}
//           onRowsPerPageChange={noop}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           rowsPerPageOptions={[5, 10, 25]}
//         />
//       </Card>
//       {selectedBooking && (
//         <Modal open={open} onClose={handleClose}>
//           <Box
//             sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, maxWidth: 500, mx: 'auto', mt: 4 }}
//           >
//             <Typography variant="h6" component="h2">
//               Booking Details
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>ID: {selectedBooking.id}</Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Service Name: {selectedBooking.serviceName}</Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Phone: {selectedBooking.phone}</Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
//               Pickup Address: {selectedBooking.pickupAddress.city}
//             </Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Drop Address: {selectedBooking.dropAddress.city}</Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
//               Date: {dayjs(selectedBooking.date).format('MMM D, YYYY')}
//             </Typography>
//             <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
//               Status: {statusMap[selectedBooking.status]?.label ?? 'Unknown'}
//             </Typography>
//             <CardActionArea sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
//               {selectedBooking.approval === 'approved' && (
//                 <Button onClick={() => handleTrackOpen(selectedBooking)} size="small" variant="outlined">
//                   Track
//                 </Button>
//               )}
//               <Button onClick={handleClose} size="small" variant="outlined" color="error">
//                 Close
//               </Button>
//             </CardActionArea>
//           </Box>
//         </Modal>
//       )}

//       {selectedBooking && trackOpen && (
//         <Modal open={trackOpen} onClose={handleTrackClose}>
//           <Box
//             sx={{
//               p: 4,
//               bgcolor: 'background.paper',
//               borderRadius: 1,
//               boxShadow: 24,
//               maxWidth: 800,
//               mx: 'auto',
//               mt: 4,
//             }}
//           >
//             <Typography variant="h6" component="h2">
//               Tracking Details
//             </Typography>
//             <Divider sx={{ my: 2 }} />

//             {currentLocation && (
//               <MapContainer
//                 center={[currentLocation.lat, currentLocation.lng]}
//                 zoom={13}
//                 style={{ height: '400px', width: '100%' }}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution="&copy; OpenStreetMap contributors"
//                 />

//                 <Marker position={[currentLocation.lat, currentLocation.lng]}>
//                   <Popup>Current Location</Popup>
//                 </Marker>

//                 <Marker position={[selectedBooking.pickupAddress.lat, selectedBooking.pickupAddress.lng]}>
//                   <Popup>Pickup Location: {selectedBooking.pickupAddress.city}</Popup>
//                 </Marker>

//                 <Marker position={[selectedBooking.dropAddress.lat, selectedBooking.dropAddress.lng]}>
//                   <Popup>Drop Location: {selectedBooking.dropAddress.city}</Popup>
//                 </Marker>
//               </MapContainer>
//             )}

//             <Button onClick={handleClose} size="small" variant="outlined" color="error" sx={{ mt: 2 }}>
//               Close
//             </Button>
//           </Box>
//         </Modal>
//       )}
//     </>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
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
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

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

export interface Bookings {
  id: string;
  userId: string;
  serviceName: string;
  pickupAddress: {
    city: string;
    state: string;
    zip: string;
    street: string;
    coords: { lat: number; lng: number };
  };
  dropAddress: {
    city: string;
    state: string;
    zip: string;
    street: string;
    coords: { lat: number; lng: number };
  };
  pickupDate: Date;
  estimatedPrice: number;
  status: 'pending' | 'enroute to pickup' | 'enroute to drop' | 'cancelled' | 'delivered';
  approvals: 'approved' | 'not approved';
  phone: string;
  allocatedDriverPhone: string;
}

interface BookingsTableProps {
  count?: number;
  page?: number;
  rows?: Bookings[];
  rowsPerPage?: number;
}

export function BookingsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: BookingsTableProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Bookings | null>(null);
  const [trackOpen, setTrackOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleOpen = (booking: Bookings) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const handleTrackOpen = (booking: Bookings) => {
    setSelectedBooking(booking);
    setOpen(false);
    setTrackOpen(true);
  };

  const handleTrackClose = () => {
    setTrackOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    if (selectedBooking) {
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
  }, [selectedBooking]);

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Approval</TableCell>
                {/* <TableCell>ID</TableCell> */}
                <TableCell>Service Name</TableCell>
                <TableCell sortDirection="desc">Pickup Date</TableCell>
                <TableCell>Pick Up Address</TableCell>
                <TableCell>Drop Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Driver Phone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const { label, color } = statusMap[row.status] ?? { label: 'Unknown', color: 'default' };
                const { label: approvalLabel, color: approvalColor } = approvalMap[row.approvals] ?? {
                  label: 'Unknown',
                  color: 'default',
                };
                return (
                  <TableRow hover key={row.id} onClick={() => handleOpen(row)} style={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Chip color={approvalColor} label={approvalLabel} size="small" />
                    </TableCell>
                    {/* <TableCell>{row.id}</TableCell> */}
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.serviceName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{dayjs(row.pickupDate).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{row.pickupAddress.city}</TableCell>
                    <TableCell>{row.dropAddress.city}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.allocatedDriverPhone}</TableCell>

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
      {selectedBooking && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, maxWidth: 500, mx: 'auto', mt: 4 }}
          >
            <Typography variant="h6" component="h2">
              Booking Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>ID: {selectedBooking.id}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Service Name: {selectedBooking.serviceName}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Phone: {selectedBooking.phone}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Pickup Address: {selectedBooking.pickupAddress.city}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Drop Address: {selectedBooking.dropAddress.city}</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Date: {dayjs(selectedBooking.pickupDate).format('MMM D, YYYY')}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Status: {statusMap[selectedBooking.status]?.label ?? 'Unknown'}
            </Typography>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
              {selectedBooking.approvals && (
                <Button onClick={() => handleTrackOpen(selectedBooking)} size="small" variant="outlined">
                  Track
                </Button>
              )}
              <Button onClick={handleClose} size="small" variant="outlined" color="error">
                Close
              </Button>
            </CardActionArea>
          </Box>
        </Modal>
      )}

      {selectedBooking && trackOpen && (
        <Modal open={trackOpen} onClose={handleTrackClose}>
          <Box
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              maxWidth: 800,
              mx: 'auto',
              mt: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Tracking Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            {currentLocation && (
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <Marker position={[currentLocation.lat, currentLocation.lng]}>
                  <Popup>Current Location</Popup>
                </Marker>

                <Marker position={[selectedBooking.pickupAddress.coords.lat, selectedBooking.pickupAddress.coords.lng]}>
                  <Popup>Pickup Location: {selectedBooking.pickupAddress.city}</Popup>
                </Marker>

                <Marker position={[selectedBooking.dropAddress.coords.lat, selectedBooking.dropAddress.coords.lng]}>
                  <Popup>Drop Location: {selectedBooking.dropAddress.city}</Popup>
                </Marker>
              </MapContainer>
            )}

            <Button onClick={handleClose} size="small" variant="outlined" color="error" sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
}
